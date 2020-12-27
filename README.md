# DJANGO & REACT

### Setting

```shell
cd django-react/backend/

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt

export $(cat .env | xargs)

python manage.py runserver
```

### Frontend

```shell
cd django-react/frontend/

# dev mode
yarn start:dev

# prod mode
yarn build
```
