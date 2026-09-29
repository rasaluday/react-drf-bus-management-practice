from django.urls import path

from .views import (
    BusListCreateAPIView,
    BusDetailAPIView,
)


urlpatterns = [

    path(
        "buses/",
        BusListCreateAPIView.as_view(),
        name="bus-list-create"
    ),

    path(
        "buses/<int:pk>/",
        BusDetailAPIView.as_view(),
        name="bus-detail"
    ),

]