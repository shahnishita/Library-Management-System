# tasks.py
from celery import shared_task
from .models import *
from django.utils import timezone

@shared_task
def update_records():
    records = BookBorrow.objects.filter(return_date__lt=timezone.now(), timeUp=False)
    
    for record in records:
        record.update_time_up()
        record.save()
        
@shared_task
def send_email():
    records = BookBorrow.objects.filter(timeUp=True, isEmailSend=False, isReturned=False)
    
    for record in records:
        record.send_Email_if_needed()
        record.save()

@shared_task
def clean_email():
    records = BookBorrow.objects.filter(timeUp=True, isEmailSend=True, isReturned=False)
    
    for record in records:
        record.clear_isEmailSend()
        record.save()

@shared_task
def calculate_fine():
    records = BookBorrow.objects.filter(timeUp=True, isReturned=False)
    
    for record in records:
        record.late_fine()
        record.save()


@shared_task
def csrf_expire():
    records = CSRFToken.objects.filter(expired_at__lt=timezone.now())
    
    for record in records:
        record.delete()
        
        
@shared_task
def token_expire():
    records = Token.objects.filter(expired_at__lt=timezone.now())
    
    for record in records:
        record.delete()