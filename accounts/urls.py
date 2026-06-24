from django.urls import path
from .views import (
    RegisterAPIView, 
    # login_view, 
    MeAPIView
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenObtainPairView
)

urlpatterns = [
    path('register/', RegisterAPIView.as_view()),
    # path('login/', login_view),
    path('me/', MeAPIView.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh')
]