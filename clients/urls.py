# from django.urls import path
# from .views import (ClientDetailAPIView, ClientListCreateAPIView)

# urlpatterns = [
#     path('', ClientListCreateAPIView.as_view()),
#     path('<int:pk>/', ClientDetailAPIView.as_view())
# ]


from rest_framework.routers import DefaultRouter
from .views import ClientViewSet

router = DefaultRouter()

router.register(
    '',
    ClientViewSet,
    basename='client'
)

urlpatterns = router.urls