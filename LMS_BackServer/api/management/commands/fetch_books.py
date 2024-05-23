from django.core.management.base import BaseCommand
import requests
from datetime import datetime
from api.models import booksList

class Command(BaseCommand):
    help = 'Fetches books from an external API and saves them to the database'

    def handle(self, *args, **options):
        api_url = 'https://prasbook.onrender.com/api/books'
        response = requests.get(api_url).json()
        if requests.get(api_url).status_code == 200:
            for book in response['Books']:
                name = book['name']
                author_list = book['author']
                author = '$ '.join(author_list)
                
                publisher_list = book['publisher']
                publishers = '$ '.join(publisher_list)
                
                isbn_list = book['ISBN']
                ISBN = '$ '.join(isbn_list)
                
                genre_list = book['genre']
                genre = '$ '.join(genre_list)
                    
                thumbnail = book['thumbnail']
                website = book['website']
                description = book['description']
                
                language_list = book['language']
                language = '$ '.join(language_list)
                
                publish_date_api = book['published'][0]
                try:
                    req_publish_date_obj = datetime.strptime(publish_date_api, "%d %B %Y")
                except ValueError:
                    try:
                        req_publish_date_obj = datetime.strptime(publish_date_api, "%B %d, %Y")
                    except ValueError:
                        pass

                publish_date = req_publish_date_obj.strftime("%Y-%m-%d")
                page = book['no of pages']
                
                push = booksList(
                    title=name, 
                    author=author, 
                    publisher=publishers, 
                    publish_date=publish_date, 
                    pages=page, 
                    thumbnail=thumbnail, 
                    language=language, 
                    ISBN=ISBN, 
                    genre=genre, 
                    website=website, 
                    description=description, 
                    isAvailable=True, 
                    quantity=20
                )
                push.save()
                if push:
                    self.stdout.write(self.style.SUCCESS('Successfully fetched data from the API'))
        else:
            self.stdout.write(self.style.ERROR('Failed to fetch data from the API'))
