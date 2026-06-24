# # from rest_framework.decorators import api_view
# # from rest_framework.response import Response
# # from rest_framework import status

# # from .models import Project
# # from .serializers import ProjectSerializer

# # @api_view(['GET', 'POST'])
# # def get_projects(request):
# #     if request.method == 'GET':
        
# #         projects = Project.objects.all()
        
# #         serializer = ProjectSerializer(
# #             projects, 
# #             many=True
# #         )
        
# #         return Response(serializer.data)
    
# #     elif request.method == 'POST':
# #         serializer = ProjectSerializer(
# #             data=request.data
# #         )
        
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(
# #                 serializer.data, 
# #                 status=status.HTTP_201_CREATED
# #             )
            
# #         return Response(
# #             serializer.errors,
# #             status=status.HTTP_400_BAD_REQUEST
# #         )

# from rest_framework.generics import ( ListCreateAPIView, RetrieveUpdateDestroyAPIView )
# from rest_framework.permissions import IsAuthenticated
# from .models import Project
# from .serializers import ProjectSerializer

# class ProjectListCreateAPIView(ListCreateAPIView):
    
#     serializer_class = ProjectSerializer
    
#     permission_classes = [
#         IsAuthenticated
#     ]
    
#     def get_queryset(self):
#         return Project.objects.filter(
#             created_by=self.request.user
#         )
    
#     def perform_create(
#         self, 
#         serializer
#     ):
#         serializer.save(
#             created_by=self.request.user
#         )
    
# class ProjectDetailAPIView(RetrieveUpdateDestroyAPIView):
    
#     serializer_class = ProjectSerializer
    
#     permission_classes = [
#         IsAuthenticated
#     ]
    
#     def get_queryset(self):
#         return Project.objects.filter(
#             created_by=self.request.user
#         )

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter
    ]
    
    filterset_fields = [
        'client'
    ]
    
    search_fields = [
        'title',
        'description'
    ]
    
    ordering_fields = [
        'title',
    ]
    
    def get_queryset(self):
        return Project.objects.filter(
            created_by=self.request.user
        )
    
    def perform_create(
        self, 
        serializer
    ):
        serializer.save(
            created_by=self.request.user
        )

