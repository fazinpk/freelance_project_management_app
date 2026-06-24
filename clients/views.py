# from rest_framework.response import Response
# from rest_framework.decorators import api_view
# from rest_framework import status
# from django.shortcuts import get_object_or_404

# from .models import Client
# from .serializers import ClientSerializer

# @api_view(['GET','POST'])
# def get_clients(request):
#     if request.method == 'GET':
#         clients = Client.objects.all()
    
#         serializer = ClientSerializer(
#             clients,
#             many=True
#         )
        
#         return Response(serializer.data)
    
#     elif request.method == 'POST':
#         serializer = ClientSerializer(
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
        
# @api_view(['GET'])
# def get_client(request, id):
#     client = get_object_or_404(
#         Client, 
#         id=id
#     )
    
#     serializer = ClientSerializer(client)
#     return Response(serializer.data)
        
# @api_view(['PUT'])
# def update_client(request, id):
#     client = get_object_or_404(
#         Client, 
#         id=id
#     )
    
#     serializer = ClientSerializer(
#         client,
#         data=request.data
#     )
    
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data)
    
#     return Response(
#         serializer.errors,
#         status=status.HTTP_400_BAD_REQUEST
#     )

# from rest_framework.generics import ( ListCreateAPIView, RetrieveUpdateDestroyAPIView )
# from rest_framework.permissions import IsAuthenticated
# from .models import Client
# from .serializers import ClientSerializer

# class ClientListCreateAPIView(ListCreateAPIView):
    
#     serializer_class = ClientSerializer
#     permission_classes = [
#         IsAuthenticated
#     ]
    
#     def get_queryset(self):
#         return Client.objects.filter(
#             created_by=self.request.user
#         )
    
#     def perform_create(
#         self, 
#         serializer
#     ):
#         serializer.save(
#             created_by=self.request.user
#         )

# class ClientDetailAPIView(RetrieveUpdateDestroyAPIView):
    
#     serializer_class = ClientSerializer
    
#     permission_classes = [
#         IsAuthenticated
#     ]
    
#     def get_queryset(self):
#         return Client.objects.filter(
#             created_by=self.request.user
#         )

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Client
from .serializers import ClientSerializer

class ClientViewSet(ModelViewSet):
    
    serializer_class = ClientSerializer
    permission_classes = [
        IsAuthenticated
    ]
    
    filter_backends = [
        SearchFilter,
        OrderingFilter
    ]
    
    search_fields = [
        'name',
        'email',
        'phone'
    ]
    
    ordering_fields = [
        'name'
    ]
    
    def get_queryset(self):
        return Client.objects.filter(
            created_by=self.request.user
        )
    
    def perform_create(
        self, 
        serializer
    ):
        serializer.save(
            created_by=self.request.user
        )

