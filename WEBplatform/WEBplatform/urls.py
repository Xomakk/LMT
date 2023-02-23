"""WEBplatform URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path

import lesson.urls
import timetable.urls
import user.urls
import groups.urls
import learningDirections.urls

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('admin/', admin.site.urls),

    # path to groups

    # path to our account's app endpoints
    # path('api/v1/auth/', include('djoser.urls')),
    # re_path(r'^auth/', include('djoser.urls.authtoken')),

    path('api-auth', include('rest_framework.urls')),
    path(r'api/v1/auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.jwt')),

    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]

# path to profiles
urlpatterns.extend(user.urls.urlpatterns)

# path to groups
urlpatterns.extend(groups.urls.urlpatterns)

# path to directions
urlpatterns.extend(learningDirections.urls.urlpatterns)

# path to lessons
urlpatterns.extend(lesson.urls.urlpatterns)

# path to lessons
urlpatterns.extend(timetable.urls.urlpatterns)
