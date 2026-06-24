# from django.urls import path
# from .views import (ProjectDetailAPIView, ProjectListCreateAPIView)

# urlpatterns = [
#     path('', ProjectListCreateAPIView.as_view()),
#     path('<int:pk>/', ProjectDetailAPIView.as_view())
# ]

from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet

router = DefaultRouter()

router.register(
    '',
    ProjectViewSet,
    basename='project'
)

urlpatterns = router.urls