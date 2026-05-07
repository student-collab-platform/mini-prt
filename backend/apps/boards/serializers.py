from rest_framework import serializers
from .models import Board, Column, Task
from apps.users.serializers import UserSerializer

class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        source='assigned_to',
        queryset=__import__('apps.users.models', fromlist=['User']).User.objects.all(),
        write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'column', 'assigned_to', 'assigned_to_id', 'order', 'created_at']
        extra_kwargs = {'column': {'read_only': True}}

class ColumnSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Column
        fields = ['id', 'name', 'board', 'order', 'tasks']
        extra_kwargs = {'board': {'read_only': True}}

class BoardSerializer(serializers.ModelSerializer):
    columns = ColumnSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = ['id', 'name', 'workspace', 'columns', 'created_at']
        extra_kwargs = {'workspace': {'read_only': True}}