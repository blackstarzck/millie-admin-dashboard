# 앱 리뷰 관리 페이지

## 개요
구글 플레이 스토어의 리뷰를 자동으로 가져오거나 관리자가 직접 리뷰를 작성하여 관리하는 페이지입니다.

## 주요 기능

### 1. 구글 스토어 리뷰 불러오기
- Google Play Developer API를 통해 앱 리뷰를 자동으로 가져옵니다.
- 새로운 리뷰를 데이터베이스에 저장합니다.
- 리뷰 출처는 자동으로 `google_store`로 표시됩니다.

### 2. 관리자 직접 리뷰 작성
- 관리자가 홍보용 또는 샘플 리뷰를 직접 작성할 수 있습니다.
- 리뷰 출처는 `manual`로 표시됩니다.
- 작성자, 평점, 내용, 관리자 메모를 입력할 수 있습니다.

### 3. 리뷰 노출 관리
- 각 리뷰의 노출 여부를 개별적으로 설정할 수 있습니다.
- 노출 설정 시 노출 시작일이 자동으로 기록됩니다.
- 노출 해제 시 노출 시작일이 초기화됩니다.

### 4. 리뷰 편집 및 삭제
- 모든 리뷰는 수정 가능합니다.
- 관리자 메모를 추가하여 내부 관리 용도로 활용할 수 있습니다.
- 불필요한 리뷰는 삭제할 수 있습니다.

### 5. API 리뷰 상태 추적
- 구글 스토어 API로 가져온 리뷰의 원본 상태를 추적합니다.
- **정상(active)**: 구글 스토어에 원본이 정상적으로 존재하는 상태
- **원본 수정됨(modified)**: 사용자가 구글 스토어에서 리뷰를 수정한 상태
- **원본 삭제됨(deleted)**: 사용자가 구글 스토어에서 리뷰를 삭제한 상태
- 노출 중인 리뷰는 원본이 수정/삭제되어도 자동으로 삭제되지 않고 유지됩니다.
- 관리자 직접 입력 리뷰는 API 상태가 표시되지 않습니다.

## 데이터베이스 스키마

### reviews 테이블
```sql
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  review_id VARCHAR(50) UNIQUE NOT NULL,
  source ENUM('google_store', 'manual') NOT NULL COMMENT '리뷰 출처',
  user_name VARCHAR(100) NOT NULL COMMENT '작성자 이름',
  user_id VARCHAR(255) COMMENT '구글 사용자 ID (API에서 가져온 경우)',
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5) COMMENT '평점 (1-5)',
  content TEXT NOT NULL COMMENT '리뷰 내용',
  review_date DATETIME NOT NULL COMMENT '리뷰 작성일',
  is_exposed BOOLEAN DEFAULT FALSE COMMENT '노출 여부',
  exposed_date DATETIME COMMENT '노출 시작일',
  admin_comment TEXT COMMENT '관리자 메모',
  created_by VARCHAR(50) COMMENT '등록자 (관리자 ID)',
  last_modified_by VARCHAR(50) COMMENT '최종 수정자',
  last_modified_date DATETIME COMMENT '최종 수정일',
  api_status ENUM('active', 'modified', 'deleted') COMMENT 'API 리뷰 상태 (active:정상, modified:원본수정됨, deleted:원본삭제됨) - 관리자 입력 리뷰는 NULL',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_source (source),
  INDEX idx_is_exposed (is_exposed),
  INDEX idx_rating (rating),
  INDEX idx_review_date (review_date),
  INDEX idx_api_status (api_status)
);
```

## Google Play Developer API 연동

### API 설정

1. **Google Cloud Console 설정**
   - Google Cloud Console에서 프로젝트 생성
   - Google Play Developer API 활성화
   - 서비스 계정 생성 및 JSON 키 다운로드

2. **Google Play Console 설정**
   - Play Console에서 API 액세스 설정
   - 서비스 계정에 권한 부여 (최소 "리뷰 보기" 권한)

### 백엔드 API 구현 예제 (Node.js/Express)

```javascript
const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

// Google Play Developer API 클라이언트 설정
const auth = new google.auth.GoogleAuth({
  keyFile: 'path/to/service-account-key.json',
  scopes: ['https://www.googleapis.com/auth/androidpublisher'],
});

const androidpublisher = google.androidpublisher({
  version: 'v3',
  auth: auth,
});

// 구글 스토어 리뷰 가져오기
router.post('/api/google-play-reviews', async (req, res) => {
  try {
    const packageName = 'com.your.app.package'; // 앱 패키지 이름

    // Google Play API로 리뷰 가져오기
    const response = await androidpublisher.reviews.list({
      packageName: packageName,
      maxResults: 100, // 한 번에 가져올 리뷰 수
    });

    const reviews = response.data.reviews || [];
    const processedReviews = [];

    for (const review of reviews) {
      const comment = review.comments[0].userComment;

      // 데이터베이스에 이미 존재하는지 확인
      const existingReview = await checkReviewExists(review.reviewId);

      if (!existingReview) {
        const reviewData = {
          review_id: review.reviewId,
          source: 'google_store',
          user_name: review.authorName || '익명',
          user_id: review.authorName, // Google 사용자 ID
          rating: comment.starRating,
          content: comment.text,
          review_date: comment.lastModified.seconds
            ? new Date(comment.lastModified.seconds * 1000)
            : new Date(),
          is_exposed: false,
          exposed_date: null,
          admin_comment: null,
          created_by: null,
          last_modified_by: null,
          last_modified_date: null
        };

        // 데이터베이스에 저장
        await saveReview(reviewData);
        processedReviews.push(reviewData);
      }
    }

    res.json({
      success: true,
      count: processedReviews.length,
      reviews: processedReviews
    });

  } catch (error) {
    console.error('Error fetching Google Play reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews from Google Play Store',
      message: error.message
    });
  }
});

// 데이터베이스 헬퍼 함수들
async function checkReviewExists(reviewId) {
  // 데이터베이스에서 리뷰 ID로 조회
  // 실제 구현은 사용하는 DB에 따라 다름
  // 예: const result = await db.query('SELECT * FROM reviews WHERE review_id = ?', [reviewId]);
  // return result.length > 0;
}

async function getExistingReview(reviewId) {
  // 기존 리뷰 데이터 조회
  // 예: const result = await db.query('SELECT * FROM reviews WHERE review_id = ?', [reviewId]);
  // return result[0];
}

async function saveReview(reviewData) {
  // 데이터베이스에 리뷰 저장
  // 예: await db.query('INSERT INTO reviews SET ?', [reviewData]);
}

async function updateReviewApiStatus(reviewId, status) {
  // API 상태 업데이트
  // 예: await db.query('UPDATE reviews SET api_status = ? WHERE review_id = ?', [status, reviewId]);
}

module.exports = router;
```

### API 리뷰 상태 추적 로직

구글 스토어에서 리뷰를 동기화할 때, 기존 리뷰의 상태를 확인하고 업데이트합니다:

```javascript
// 리뷰 동기화 및 상태 추적
router.post('/api/google-play-reviews/sync', async (req, res) => {
  try {
    const packageName = 'com.your.app.package';

    // 1. 현재 DB에 있는 모든 구글 스토어 리뷰 조회
    const existingReviews = await db.query(
      'SELECT review_id, user_id FROM reviews WHERE source = ?',
      ['google_store']
    );

    // 2. 구글 스토어에서 최신 리뷰 가져오기
    const response = await androidpublisher.reviews.list({
      packageName: packageName,
      maxResults: 100,
    });

    const apiReviews = response.data.reviews || [];
    const apiReviewIds = new Set();
    const processedReviews = [];

    // 3. API에서 가져온 리뷰 처리
    for (const review of apiReviews) {
      const comment = review.comments[0].userComment;
      apiReviewIds.add(review.reviewId);

      const existingReview = await getExistingReview(review.reviewId);

      if (existingReview) {
        // 기존 리뷰가 있는 경우
        const currentContent = comment.text;
        const currentRating = comment.starRating;

        // 내용이나 평점이 변경되었는지 확인
        if (existingReview.content !== currentContent ||
            existingReview.rating !== currentRating) {
          // 노출 중인 리뷰는 상태만 'modified'로 변경하고 내용은 유지
          if (existingReview.is_exposed) {
            await updateReviewApiStatus(review.reviewId, 'modified');
          } else {
            // 노출 중이 아닌 리뷰는 내용 업데이트
            await db.query(
              'UPDATE reviews SET content = ?, rating = ?, api_status = ? WHERE review_id = ?',
              [currentContent, currentRating, 'active', review.reviewId]
            );
          }
        } else {
          // 변경사항 없으면 상태를 'active'로 유지
          await updateReviewApiStatus(review.reviewId, 'active');
        }
      } else {
        // 새로운 리뷰인 경우 추가
        const reviewData = {
          review_id: review.reviewId,
          source: 'google_store',
          user_name: review.authorName || '익명',
          user_id: review.authorName,
          rating: comment.starRating,
          content: comment.text,
          review_date: new Date(comment.lastModified.seconds * 1000),
          is_exposed: false,
          api_status: 'active'
        };

        await saveReview(reviewData);
        processedReviews.push(reviewData);
      }
    }

    // 4. API에 없는 기존 리뷰는 'deleted' 상태로 변경
    for (const existing of existingReviews) {
      if (!apiReviewIds.has(existing.review_id)) {
        // 노출 중인 리뷰는 유지하되 상태를 'deleted'로 변경
        await updateReviewApiStatus(existing.review_id, 'deleted');
      }
    }

    res.json({
      success: true,
      newCount: processedReviews.length,
      message: '리뷰 동기화가 완료되었습니다.'
    });

  } catch (error) {
    console.error('Error syncing reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync reviews',
      message: error.message
    });
  }
});
```

### Python/Django 예제

```python
from google.oauth2 import service_account
from googleapiclient.discovery import build
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Review
import json

SCOPES = ['https://www.googleapis.com/auth/androidpublisher']
SERVICE_ACCOUNT_FILE = 'path/to/service-account-key.json'
PACKAGE_NAME = 'com.your.app.package'

def get_google_play_service():
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    service = build('androidpublisher', 'v3', credentials=credentials)
    return service

@require_http_methods(["POST"])
def sync_google_play_reviews(request):
    try:
        service = get_google_play_service()

        # 리뷰 가져오기
        reviews_result = service.reviews().list(
            packageName=PACKAGE_NAME,
            maxResults=100
        ).execute()

        reviews_data = reviews_result.get('reviews', [])
        processed_count = 0

        for review_item in reviews_data:
            review_id = review_item['reviewId']
            comment = review_item['comments'][0]['userComment']

            # 중복 체크
            if not Review.objects.filter(review_id=review_id).exists():
                Review.objects.create(
                    review_id=review_id,
                    source='google_store',
                    user_name=review_item.get('authorName', '익명'),
                    user_id=review_item.get('authorName'),
                    rating=comment['starRating'],
                    content=comment['text'],
                    review_date=comment['lastModified']['seconds'],
                    is_exposed=False,
                    admin_comment=None,
                    created_by=None
                )
                processed_count += 1

        return JsonResponse({
            'success': True,
            'count': processed_count,
            'message': f'{processed_count}개의 새로운 리뷰를 가져왔습니다.'
        })

    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)
```

## 프론트엔드 API 연동

현재 `AppReviewManagement.js` 파일의 `handleSyncGoogleReviews` 함수를 실제 API와 연동하려면:

```javascript
const handleSyncGoogleReviews = async () => {
  setIsSyncLoading(true);
  try {
    const response = await fetch('/api/google-play-reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}` // 인증 토큰
      }
    });

    if (!response.ok) {
      throw new Error('API 요청 실패');
    }

    const data = await response.json();

    // 새로운 리뷰를 테이블에 추가
    if (data.success && data.reviews) {
      const formattedReviews = data.reviews.map(review => ({
        key: review.review_id,
        reviewId: review.review_id,
        source: review.source,
        userName: review.user_name,
        userId: review.user_id,
        rating: review.rating,
        content: review.content,
        reviewDate: review.review_date,
        isExposed: review.is_exposed,
        exposedDate: review.exposed_date,
        adminComment: review.admin_comment,
        createdBy: review.created_by,
        lastModifiedBy: review.last_modified_by,
        lastModifiedDate: review.last_modified_date
      }));

      setReviews(prev => [...formattedReviews, ...prev]);
      message.success(`${data.count}개의 새로운 리뷰를 가져왔습니다.`);
    } else {
      message.info('새로운 리뷰가 없습니다.');
    }
  } catch (error) {
    console.error('리뷰 동기화 오류:', error);
    message.error('구글 스토어 리뷰 불러오기에 실패했습니다.');
  } finally {
    setIsSyncLoading(false);
  }
};
```

## 환경 변수 설정

`.env` 파일에 다음 환경 변수를 추가:

```env
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=/path/to/service-account-key.json
GOOGLE_PLAY_PACKAGE_NAME=com.your.app.package
GOOGLE_PLAY_API_MAX_RESULTS=100
```

## 보안 고려사항

1. **서비스 계정 키 보안**
   - 서비스 계정 JSON 키는 절대 버전 관리 시스템에 포함하지 않습니다.
   - 환경 변수나 안전한 시크릿 관리 서비스를 사용합니다.

2. **API 권한 최소화**
   - Google Play Console에서 서비스 계정에 필요한 최소 권한만 부여합니다.
   - 리뷰를 읽기만 하는 경우 "리뷰 보기" 권한만 부여합니다.

3. **인증 및 권한 관리**
   - 관리자 페이지 접근은 인증된 사용자만 가능하도록 합니다.
   - 리뷰 수정/삭제는 적절한 권한을 가진 관리자만 수행할 수 있도록 합니다.

## 참고 자료

- [Google Play Developer API 문서](https://developers.google.com/android-publisher)
- [Google Play Console API 액세스 설정](https://developers.google.com/android-publisher/getting_started)
- [googleapis npm 패키지](https://www.npmjs.com/package/googleapis)
