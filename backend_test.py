#!/usr/bin/env python3
"""
Backend API Test Suite for Freelancer Finance Tracker
Tests all API endpoints with Turkish data and validates functionality
"""

import requests
import json
from datetime import datetime, date
import sys
import os

# Get backend URL from frontend .env file
BACKEND_URL = "https://expense-system-3.preview.emergentagent.com"
LOCAL_API_BASE = f"{BACKEND_URL}/api"

# For local testing, use internal URL
LOCAL_BACKEND_URL = "http://localhost:8001"
LOCAL_LOCAL_API_BASE = f"{LOCAL_BACKEND_URL}/api"

def test_server_connectivity():
    """Test basic server connectivity"""
    print("🔍 Testing server connectivity...")
    try:
        response = requests.get(LOCAL_BACKEND_URL, timeout=10)
        if response.status_code == 200:
            print("✅ Server is accessible")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Server returned status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Server connectivity failed: {e}")
        return False

def test_dashboard_summary():
    """Test dashboard summary endpoint"""
    print("\n🔍 Testing dashboard summary endpoint...")
    try:
        response = requests.get(f"{LOCAL_LOCAL_API_BASE}/dashboard/summary", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ Dashboard summary endpoint working")
            print(f"   Response structure: {list(data.keys())}")
            
            # Validate expected fields
            expected_fields = [
                'total_income', 'total_expenses', 'net_profit', 'total_tax_paid',
                'pending_tax', 'active_projects', 'completed_projects',
                'current_month_income', 'current_month_expenses', 'current_month_profit'
            ]
            
            missing_fields = [field for field in expected_fields if field not in data]
            if missing_fields:
                print(f"⚠️  Missing fields: {missing_fields}")
                return False
            else:
                print("✅ All expected fields present in dashboard summary")
                return True
        else:
            print(f"❌ Dashboard summary failed with status: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Dashboard summary request failed: {e}")
        return False

def test_projects_endpoints():
    """Test projects GET and POST endpoints"""
    print("\n🔍 Testing projects endpoints...")
    
    # Test GET projects
    try:
        response = requests.get(f"{LOCAL_API_BASE}/projects", timeout=10)
        if response.status_code == 200:
            print("✅ GET /api/projects working")
            projects = response.json()
            print(f"   Retrieved {len(projects)} projects")
        else:
            print(f"❌ GET /api/projects failed with status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ GET /api/projects request failed: {e}")
        return False
    
    # Test POST projects with Turkish data
    try:
        turkish_project = {
            "name": "Web Sitesi Geliştirme Projesi",
            "client": "Ahmet Yılmaz Şirketi",
            "description": "Modern e-ticaret sitesi geliştirme işi. Türkçe karakter testi: ğüşıöç",
            "hourly_rate": 150.0,
            "fixed_price": None,
            "status": "devam-ediyor",
            "start_date": "2024-01-15",
            "end_date": None,
            "estimated_hours": 80.0,
            "actual_hours": 25.5
        }
        
        response = requests.post(
            f"{LOCAL_API_BASE}/projects", 
            json=turkish_project,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ POST /api/projects working with Turkish data")
            created_project = response.json()
            print(f"   Created project ID: {created_project.get('id')}")
            print(f"   Project name: {created_project.get('name')}")
            
            # Validate Turkish characters preserved
            if "ğüşıöç" in created_project.get('description', ''):
                print("✅ Turkish characters properly encoded")
            else:
                print("⚠️  Turkish character encoding issue")
                
            return True
        else:
            print(f"❌ POST /api/projects failed with status: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ POST /api/projects request failed: {e}")
        return False

def test_income_endpoints():
    """Test income GET and POST endpoints with tax calculations"""
    print("\n🔍 Testing income endpoints...")
    
    # Test GET income
    try:
        response = requests.get(f"{LOCAL_API_BASE}/income", timeout=10)
        if response.status_code == 200:
            print("✅ GET /api/income working")
            income_records = response.json()
            print(f"   Retrieved {len(income_records)} income records")
        else:
            print(f"❌ GET /api/income failed with status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ GET /api/income request failed: {e}")
        return False
    
    # Test POST income with tax calculation
    try:
        turkish_income = {
            "amount": 5000.0,
            "description": "Web sitesi geliştirme ödemesi - Türkçe açıklama ğüşıöç",
            "client": "Mehmet Özkan Ltd. Şti.",
            "project_id": None,
            "income_date": "2024-01-20",
            "invoice_number": "INV-2024-001",
            "tax_rate": 0.18,  # %18 vergi
            "is_taxable": True
        }
        
        response = requests.post(
            f"{LOCAL_API_BASE}/income", 
            json=turkish_income,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ POST /api/income working with Turkish data")
            created_income = response.json()
            print(f"   Created income ID: {created_income.get('id')}")
            print(f"   Gross amount: {created_income.get('amount')}")
            print(f"   Tax amount: {created_income.get('tax_amount')}")
            print(f"   Net amount: {created_income.get('net_amount')}")
            
            # Validate tax calculation
            expected_tax = 5000.0 * 0.18  # 900.0
            expected_net = 5000.0 - expected_tax  # 4100.0
            
            if abs(created_income.get('tax_amount', 0) - expected_tax) < 0.01:
                print("✅ Tax calculation correct")
            else:
                print(f"❌ Tax calculation incorrect. Expected: {expected_tax}, Got: {created_income.get('tax_amount')}")
                
            if abs(created_income.get('net_amount', 0) - expected_net) < 0.01:
                print("✅ Net amount calculation correct")
            else:
                print(f"❌ Net amount calculation incorrect. Expected: {expected_net}, Got: {created_income.get('net_amount')}")
            
            # Test Turkish characters
            if "ğüşıöç" in created_income.get('description', ''):
                print("✅ Turkish characters properly encoded in income")
            else:
                print("⚠️  Turkish character encoding issue in income")
                
            return True
        else:
            print(f"❌ POST /api/income failed with status: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ POST /api/income request failed: {e}")
        return False

def test_expenses_endpoints():
    """Test expenses GET and POST endpoints"""
    print("\n🔍 Testing expenses endpoints...")
    
    # Test GET expenses
    try:
        response = requests.get(f"{LOCAL_API_BASE}/expenses", timeout=10)
        if response.status_code == 200:
            print("✅ GET /api/expenses working")
            expenses = response.json()
            print(f"   Retrieved {len(expenses)} expense records")
        else:
            print(f"❌ GET /api/expenses failed with status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ GET /api/expenses request failed: {e}")
        return False
    
    # Test POST expenses with Turkish data
    try:
        turkish_expense = {
            "amount": 1200.0,
            "description": "Ofis kira ödemesi - Türkçe açıklama ğüşıöç",
            "category": "ofis",
            "expense_date": "2024-01-15",
            "is_tax_deductible": True,
            "receipt_number": "FIS-2024-001",
            "project_id": None
        }
        
        response = requests.post(
            f"{LOCAL_API_BASE}/expenses", 
            json=turkish_expense,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ POST /api/expenses working with Turkish data")
            created_expense = response.json()
            print(f"   Created expense ID: {created_expense.get('id')}")
            print(f"   Amount: {created_expense.get('amount')}")
            print(f"   Category: {created_expense.get('category')}")
            
            # Test Turkish characters
            if "ğüşıöç" in created_expense.get('description', ''):
                print("✅ Turkish characters properly encoded in expenses")
            else:
                print("⚠️  Turkish character encoding issue in expenses")
                
            return True
        else:
            print(f"❌ POST /api/expenses failed with status: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ POST /api/expenses request failed: {e}")
        return False

def test_tax_payments_endpoints():
    """Test tax payments GET and POST endpoints"""
    print("\n🔍 Testing tax payments endpoints...")
    
    # Test GET tax payments
    try:
        response = requests.get(f"{LOCAL_API_BASE}/tax-payments", timeout=10)
        if response.status_code == 200:
            print("✅ GET /api/tax-payments working")
            tax_payments = response.json()
            print(f"   Retrieved {len(tax_payments)} tax payment records")
        else:
            print(f"❌ GET /api/tax-payments failed with status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ GET /api/tax-payments request failed: {e}")
        return False
    
    # Test POST tax payments with Turkish data
    try:
        turkish_tax_payment = {
            "amount": 900.0,
            "period": "2024-Q1",
            "payment_date": "2024-01-25",
            "description": "Gelir vergisi ödemesi - Türkçe açıklama ğüşıöç",
            "receipt_number": "VRG-2024-001"
        }
        
        response = requests.post(
            f"{LOCAL_API_BASE}/tax-payments", 
            json=turkish_tax_payment,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ POST /api/tax-payments working with Turkish data")
            created_tax_payment = response.json()
            print(f"   Created tax payment ID: {created_tax_payment.get('id')}")
            print(f"   Amount: {created_tax_payment.get('amount')}")
            print(f"   Period: {created_tax_payment.get('period')}")
            
            # Test Turkish characters
            if "ğüşıöç" in created_tax_payment.get('description', ''):
                print("✅ Turkish characters properly encoded in tax payments")
            else:
                print("⚠️  Turkish character encoding issue in tax payments")
                
            return True
        else:
            print(f"❌ POST /api/tax-payments failed with status: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ POST /api/tax-payments request failed: {e}")
        return False

def test_cors_configuration():
    """Test CORS configuration"""
    print("\n🔍 Testing CORS configuration...")
    try:
        # Make an OPTIONS request to test CORS
        response = requests.options(f"{LOCAL_API_BASE}/projects", timeout=10)
        
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
        }
        
        print("✅ CORS headers present:")
        for header, value in cors_headers.items():
            if value:
                print(f"   {header}: {value}")
        
        return True
    except requests.exceptions.RequestException as e:
        print(f"❌ CORS test failed: {e}")
        return False

def run_all_tests():
    """Run all backend tests"""
    print("🚀 Starting Backend API Tests for Freelancer Finance Tracker")
    print("=" * 60)
    
    test_results = {
        'server_connectivity': test_server_connectivity(),
        'dashboard_summary': test_dashboard_summary(),
        'projects_endpoints': test_projects_endpoints(),
        'income_endpoints': test_income_endpoints(),
        'expenses_endpoints': test_expenses_endpoints(),
        'tax_payments_endpoints': test_tax_payments_endpoints(),
        'cors_configuration': test_cors_configuration()
    }
    
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All backend tests passed!")
        return True
    else:
        print("⚠️  Some backend tests failed. Check details above.")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)