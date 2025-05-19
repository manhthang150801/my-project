from contextlib import closing

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .controller import questioncontroller
from .controller import topiccontroller
from .controller import answercontroller
from .controller import surveycontroller
from .controller import surveyrescontroller
from .controller import informationcontroller
from .controller import interestcontroller
from .controller import jobcontroller
from .controller import educationcontroller
from .controller import incomecontroller
from .controller import usercontroller
from .controller import rolecontroller
from .controller import logincontroller
from .controller import jobrecommendcontroller
from .database.session import init_db, get_db
from .service.impl.roleserviceimpl import RoleServiceImpl
from .service.impl.userserviceimpl import UserServiceImpl

# app = FastAPI()
app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)


allow_origins = [
    "http://localhost:5173",
    "http://45.93.137.236",
    "https://tuvanhuongnghiepthpt.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()
    role_service = RoleServiceImpl()
    user_service = UserServiceImpl()
    with closing(next(get_db())) as db:
        role_service.initialize_roles(db)
        user_service.initialize_account(db)

app.include_router(questioncontroller.router, prefix="/api/v1")
app.include_router(topiccontroller.router, prefix="/api/v1")
app.include_router(answercontroller.router, prefix="/api/v1")
app.include_router(interestcontroller.router, prefix="/api/v1")
app.include_router(surveyrescontroller.router, prefix="/api/v1")
app.include_router(surveycontroller.router, prefix="/api/v1")
app.include_router(informationcontroller.router, prefix="/api/v1")
app.include_router(jobcontroller.router, prefix="/api/v1")
app.include_router(educationcontroller.router, prefix="/api/v1")
app.include_router(incomecontroller.router, prefix="/api/v1")
app.include_router(usercontroller.router, prefix="/api/v1")
app.include_router(rolecontroller.router, prefix="/api/v1")
app.include_router(logincontroller.router, prefix="/api/v1")
app.include_router(jobrecommendcontroller.router, prefix="/api/v1")