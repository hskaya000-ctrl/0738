from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date
from enum import Enum
import uuid
import os

app = FastAPI(title="Freelancer Finance Tracker", version="1.0.0")

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enum'lar
class ProjectStatus(str, Enum):
    ONGOING = "devam-ediyor"
    COMPLETED = "tamamlandi"
    INVOICED = "faturalandi"
    PAID = "odendi"
    CANCELLED = "iptal-edildi"

class ExpenseCategory(str, Enum):
    OFFICE = "ofis"
    EQUIPMENT = "ekipman"
    SOFTWARE = "yazilim"
    INTERNET = "internet"
    PHONE = "telefon"
    TRAVEL = "seyahat"
    EDUCATION = "egitim"
    MARKETING = "pazarlama"
    OTHER = "diger"

# Pydantic Modelleri
class ProjectBase(BaseModel):
    name: str = Field(..., description="Proje adı")
    client: str = Field(..., description="Müşteri adı")
    description: Optional[str] = Field(None, description="Proje açıklaması")
    hourly_rate: Optional[float] = Field(None, description="Saatlik ücret")
    fixed_price: Optional[float] = Field(None, description="Sabit fiyat")
    status: ProjectStatus = Field(ProjectStatus.ONGOING, description="Proje durumu")
    start_date: date = Field(..., description="Başlangıç tarihi")
    end_date: Optional[date] = Field(None, description="Bitiş tarihi")
    estimated_hours: Optional[float] = Field(None, description="Tahmini saat")
    actual_hours: Optional[float] = Field(0, description="Gerçek saat")

class Project(ProjectBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now())
    updated_at: datetime = Field(default_factory=lambda: datetime.now())

class IncomeBase(BaseModel):
    amount: float = Field(..., description="Tutar")
    description: str = Field(..., description="Açıklama")
    client: str = Field(..., description="Müşteri")
    project_id: Optional[str] = Field(None, description="Proje ID")
    income_date: date = Field(..., description="Tarih")
    invoice_number: Optional[str] = Field(None, description="Fatura numarası")
    tax_rate: float = Field(0.2, description="Vergi oranı (varsayılan %20)")
    is_taxable: bool = Field(True, description="Vergiye tabi mi?")

class Income(IncomeBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now())
    net_amount: float = Field(0, description="Net tutar (vergi sonrası)")
    tax_amount: float = Field(0, description="Vergi tutarı")

class ExpenseBase(BaseModel):
    amount: float = Field(..., description="Tutar")
    description: str = Field(..., description="Açıklama")
    category: ExpenseCategory = Field(..., description="Kategori")
    expense_date: date = Field(..., description="Tarih")
    is_tax_deductible: bool = Field(True, description="Vergi indirimi var mı?")
    receipt_number: Optional[str] = Field(None, description="Fiş numarası")
    project_id: Optional[str] = Field(None, description="Proje ID")

class Expense(ExpenseBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now())

class TaxPaymentBase(BaseModel):
    amount: float = Field(..., description="Ödenen vergi tutarı")
    period: str = Field(..., description="Dönem (örn: 2024-Q1)")
    payment_date: date = Field(..., description="Ödeme tarihi")
    description: Optional[str] = Field(None, description="Açıklama")
    receipt_number: Optional[str] = Field(None, description="Makbuz numarası")

class TaxPayment(TaxPaymentBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now())

class DashboardSummary(BaseModel):
    total_income: float = Field(0, description="Toplam gelir")
    total_expenses: float = Field(0, description="Toplam gider")
    net_profit: float = Field(0, description="Net kar")
    total_tax_paid: float = Field(0, description="Ödenen vergi")
    pending_tax: float = Field(0, description="Bekleyen vergi")
    active_projects: int = Field(0, description="Aktif proje sayısı")
    completed_projects: int = Field(0, description="Tamamlanan proje sayısı")
    current_month_income: float = Field(0, description="Bu ay gelir")
    current_month_expenses: float = Field(0, description="Bu ay gider")
    current_month_profit: float = Field(0, description="Bu ay net kar")

# API Endpoints (Frontend localStorage ile senkronize edilecek)
@app.get("/")
async def root():
    return {"message": "Freelancer Finance Tracker API"}

@app.get("/api/dashboard/summary", response_model=DashboardSummary)
async def get_dashboard_summary():
    """
    Dashboard özeti - Frontend localStorage'dan veri alacak
    Bu endpoint sadece model yapısını göstermek için
    """
    return DashboardSummary()

@app.get("/api/projects", response_model=List[Project])
async def get_projects():
    """Projeleri listele"""
    return []

@app.post("/api/projects", response_model=Project)
async def create_project(project: ProjectBase):
    """Yeni proje oluştur"""
    new_project = Project(**project.dict())
    return new_project

@app.get("/api/income", response_model=List[Income])
async def get_income():
    """Gelir kayıtlarını listele"""
    return []

@app.post("/api/income", response_model=Income)
async def create_income(income: IncomeBase):
    """Yeni gelir kaydı oluştur"""
    new_income = Income(**income.dict())
    # Vergi hesaplama
    if new_income.is_taxable:
        new_income.tax_amount = new_income.amount * new_income.tax_rate
        new_income.net_amount = new_income.amount - new_income.tax_amount
    else:
        new_income.tax_amount = 0
        new_income.net_amount = new_income.amount
    return new_income

@app.get("/api/expenses", response_model=List[Expense])
async def get_expenses():
    """Gider kayıtlarını listele"""
    return []

@app.post("/api/expenses", response_model=Expense)
async def create_expense(expense: ExpenseBase):
    """Yeni gider kaydı oluştur"""
    new_expense = Expense(**expense.dict())
    return new_expense

@app.get("/api/tax-payments", response_model=List[TaxPayment])
async def get_tax_payments():
    """Vergi ödemelerini listele"""
    return []

@app.post("/api/tax-payments", response_model=TaxPayment)
async def create_tax_payment(tax_payment: TaxPaymentBase):
    """Yeni vergi ödemesi kaydı oluştur"""
    new_tax_payment = TaxPayment(**tax_payment.dict())
    return new_tax_payment

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)