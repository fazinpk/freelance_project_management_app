from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
# from rest_framework.response import Response
from django.contrib.auth.models import User
# from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated

from .serializers import RegistrationSerializer, UserSerializer

class RegisterAPIView(CreateAPIView):
    
    queryset = User.objects.all()
    serializer_class = RegistrationSerializer
    
# @api_view(['POST'])
# def login_view(request):
    # Implement your login logic here
    # username = request.data.get('username')
    # password = request.data.get('password')
    
    # user = authenticate(
    #     username=username, 
    #     password=password
    # )
    
    # if user is not None:
        
    #     token, created = Token.objects.get_or_create(
    #         user=user
    #     )
        
    #     return Response({
    #         "token": token.key
    #     })
        
    # else:
    #     return Response({
    #         "message": "Invalid credentials"
    #     }, status=401)
        
class MeAPIView(RetrieveAPIView):
    
    serializer_class = UserSerializer
    
    permission_classes = [
        IsAuthenticated
    ]
    
    def get_object(self):
        return self.request.user
        

