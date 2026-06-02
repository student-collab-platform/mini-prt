from rest_framework import serializers
from .models import Board, Column, Task, Comment, Label, Activity
from apps.users.serializers import UserSerializer

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at']
        extra_kwargs = {'task': {'read_only': True}}

class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['id', 'name', 'color', 'board']
        extra_kwargs = {'board': {'read_only': True}}           

class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        source='assigned_to',
        queryset=__import__('apps.users.models', fromlist=['User']).User.objects.all(),
        write_only=True, required=False, allow_null=True
    )
    comments = CommentSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()
    labels = LabelSerializer(many=True, read_only=True)
    label_ids = serializers.PrimaryKeyRelatedField(
        source='labels',
        queryset=Label.objects.all(),
        many=True, write_only=True, required=False
    )

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'column', 'assigned_to',
            'assigned_to_id', 'order', 'priority', 'due_date',
            'is_completed', 'created_at', 'comments', 'comments_count',
            'labels', 'label_ids'
        ]
        extra_kwargs = {'column': {'read_only': True}}

    def get_comments_count(self, obj):
        return obj.comments.count()

class ColumnSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    tasks_count = serializers.SerializerMethodField()
    completed_count = serializers.SerializerMethodField()

    class Meta:
        model = Column
        fields = ['id', 'name', 'board', 'order', 'tasks', 'tasks_count', 'completed_count']
        extra_kwargs = {'board': {'read_only': True}}

    def get_tasks_count(self, obj):
        return obj.tasks.count()

    def get_completed_count(self, obj):
        return obj.tasks.filter(is_completed=True).count()

class BoardSerializer(serializers.ModelSerializer):
    columns = ColumnSerializer(many=True, read_only=True)
    total_tasks = serializers.SerializerMethodField()
    completed_tasks = serializers.SerializerMethodField()
    labels = LabelSerializer(many=True, read_only=True)


    class Meta:
        model = Board
        fields = ['id', 'name', 'workspace', 'columns', 'created_at', 'total_tasks', 'completed_tasks', 'labels']
        extra_kwargs = {'workspace': {'read_only': True}}

    def get_total_tasks(self, obj):
        return Task.objects.filter(column__board=obj).count()

    def get_completed_tasks(self, obj):
        return Task.objects.filter(column__board=obj, is_completed=True).count()
    



class ActivitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Activity
        fields = ['id', 'user', 'action', 'created_at']