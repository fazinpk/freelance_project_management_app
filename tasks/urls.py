# from django.urls import path
# from .views import (TaskListCreateAPIView,TaskDetailAPIView)

# urlpatterns = [
#     path('', TaskListCreateAPIView.as_view()),
#     path('<int:pk>/', TaskDetailAPIView.as_view())
# ]

from rest_framework.routers import DefaultRouter

from .views import TaskViewSet, TaskAttachmentViewSet

router = DefaultRouter()

router.register(
    'list', 
    TaskViewSet, 
    basename='task'
)

router.register(
    'attachments', 
    TaskAttachmentViewSet, 
    basename='attachment'
)

urlpatterns = router.urls