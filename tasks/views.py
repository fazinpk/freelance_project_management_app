# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status

# from .models import Task
# from .serializers import TaskSerializer

# # Create your views here.
# @api_view(['GET','POST'])
# def get_tasks(request):
    
#     if request.method == 'GET':
        
#         tasks = Task.objects.all()
    
#         serializer = TaskSerializer(
#             tasks,
#             many=True
#         )
        
#         return Response(serializer.data)
    
#     elif request.method == 'POST':
        
#         serializer = TaskSerializer(
#             data=request.data
#         )
        
#         if serializer.is_valid():
            
#             serializer.save()
            
#             return Response(
#                 serializer.data,
#                 status=status.HTTP_201_CREATED
#             )
        
#         return Response(
#             serializer.errors, 
#             status=status.HTTP_400_BAD_REQUEST
#         )

# from rest_framework.generics import ( ListCreateAPIView, RetrieveUpdateDestroyAPIView )
# from rest_framework.permissions import IsAuthenticated
# from .models import Task
# from .serializers import TaskSerializer

# class TaskListCreateAPIView(ListCreateAPIView):
    
#     serializer_class = TaskSerializer
    
#     permission_classes = [
#         IsAuthenticated
#     ]
    
#     def get_queryset(self):
#         return Task.objects.filter(
#             created_by=self.request.user
#         )
    
#     def perform_create(
#         self, 
#         serializer
#     ):
#         serializer.save(
#             created_by=self.request.user
#         )
    
    
    
# class TaskDetailAPIView(RetrieveUpdateDestroyAPIView):
    
#     serializer_class = TaskSerializer
    
#     permission_classes = [
#         IsAuthenticated
#     ]
    
#     def get_queryset(self):
#         return Task.objects.filter(
#             created_by=self.request.user
#         )

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Task, TaskAttachment
from .serializers import TaskSerializer , TaskAttachmentSerializer

from .permissions import IsOwner

class TaskViewSet(ModelViewSet):
    
    serializer_class = TaskSerializer
    
    permission_classes = [
        IsAuthenticated,
        IsOwner
    ]
    
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter
    ]
    
    filterset_fields = [
        'status',
        'priority',
    ]
    
    search_fields = [
        'title',
        'description'
    ]
    
    ordering_fields = [
        'title',
        'status',
        'priority'
    ]

    def get_queryset(self):
        return Task.objects.filter(
            created_by=self.request.user
        )
    
    def perform_create(
        self, 
        serializer
    ):
        serializer.save(
            created_by=self.request.user
        )
        
class TaskAttachmentViewSet(ModelViewSet):
    
    serializer_class = TaskAttachmentSerializer
    
    permission_classes = [
        IsAuthenticated,
    ]
    
    def get_queryset(self):
        return TaskAttachment.objects.filter(
            task__created_by=self.request.user
        )
    
    
    
    
