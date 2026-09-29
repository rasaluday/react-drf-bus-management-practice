from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from buses.models import Bus
from .serializers import BusSerializer


class BusListCreateAPIView(APIView):

    # ============================
    # GET ALL BUSES
    # ============================
    def get(self, request):

        buses = Bus.objects.all()

        serializer = BusSerializer(
            buses,
            many=True
        )

        return Response(serializer.data)


    # ============================
    # ADD BUS
    # ============================
    def post(self, request):

        serializer = BusSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class BusDetailAPIView(APIView):

    # ============================
    # GET ONE BUS
    # ============================
    def get(self, request, pk):

        try:
            bus = Bus.objects.get(pk=pk)

        except Bus.DoesNotExist:

            return Response(
                {"error": "Bus not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BusSerializer(bus)

        return Response(serializer.data)


    # ============================
    # UPDATE BUS
    # ============================
    def patch(self, request, pk):

        try:
            bus = Bus.objects.get(pk=pk)

        except Bus.DoesNotExist:

            return Response(
                {"error": "Bus not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BusSerializer(
            bus,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


    # ============================
    # DELETE BUS
    # ============================
    def delete(self, request, pk):

        try:
            bus = Bus.objects.get(pk=pk)

        except Bus.DoesNotExist:

            return Response(
                {"error": "Bus not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        bus.delete()

        return Response(
            {"message": "Bus deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )