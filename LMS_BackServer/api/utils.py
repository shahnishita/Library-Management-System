import base64
from datetime import datetime
import random
import uuid
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings


def uidGen(username):
    firstFilter = str(uuid.uuid4()).replace('-', '')
    firstFilterToList = list(firstFilter)
    random.shuffle(firstFilterToList)
    secondFilter = ''.join(firstFilterToList)
    thirdFilter = str(username)+str(secondFilter)
    thirdFilterWithHyphens = '-'.join([thirdFilter[i:i+5] for i in range(0, len(secondFilter), 5)])
    
    return thirdFilterWithHyphens


def save_image(base64_data, name, pic_type):
    _, image_data = base64_data.split(',')
    img_data = base64.b64decode(image_data)
    _name = name.replace(' ', '-')
    
    current_datetime = datetime.now().strftime("%I%M%S-%Y%m%d")
    img_name = f'{_name}-{current_datetime}-{uuid.uuid4().hex}.png'
    
    with open(f'media/{pic_type}/{img_name}', 'wb') as f:
        f.write(img_data)
    
    return f'media/{pic_type}/{img_name}'



def send_notification_to_user(user, message, staff, subject, NotificationGroup, Notification):
    group, created = NotificationGroup.objects.get_or_create(user=user, name=user.username)
    Notification.objects.create(group=group, message=message, notification_from=staff, subject=subject)

def send_email_to_user(user, message, staff, subject):

    email_content = render_to_string(
        'notification.html', 
        {
            'notification_body': message,
            'username': user.username,
            'notification_from': staff.username,
        }
    )
    send_mail(
        subject,
        '', 
        settings.EMAIL_HOST_USER,  # From email
        [user.email],  # To email
        html_message=email_content, 
        fail_silently=False,
    )
