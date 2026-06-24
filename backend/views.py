from django.http import JsonResponse

def hello(request):
    name = "Fazin"
    return JsonResponse({
        "message": f"Hello, {name}!"
    })