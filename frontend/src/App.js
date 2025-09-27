import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

const App = () => {
  // State yönetimi
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [taxPayments, setTaxPayments] = useState([]);
  const [showForm, setShowForm] = useState(null);
  const [editItem, setEditItem] = useState(null); // Düzenleme için
  const [currentProfile, setCurrentProfile] = useState('default');
  const [profiles, setProfiles] = useState(['default']);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const [dashboardFilter, setDashboardFilter] = useState({
    type: 'month', // 'month' veya 'year'
    year: currentYear, // Güncel yıl
    month: currentMonth // Güncel ay
  });
  const [projectsFilter, setProjectsFilter] = useState({
    type: 'month',
    year: currentYear,
    month: currentMonth
  });
  const [incomesFilter, setIncomesFilter] = useState({
    type: 'month',
    year: currentYear,
    month: currentMonth
  });
  const [expensesFilter, setExpensesFilter] = useState({
    type: 'month',
    year: currentYear,
    month: currentMonth
  });
  const [taxesFilter, setTaxesFilter] = useState({
    type: 'month',
    year: currentYear,
    month: currentMonth
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Online durumu
  const [darkMode, setDarkMode] = useState(false); // Dark mode durumu
  const [agenda, setAgenda] = useState([]); // Ajanda notları
  const [appTitle, setAppTitle] = useState('Freelancer Finans Takip'); // Düzenlenebilir başlık
  const [isEditingTitle, setIsEditingTitle] = useState(false); // Başlık düzenleme durumu
  const [regularExpenses, setRegularExpenses] = useState([]); // Düzenli giderler
  const [subscriptions, setSubscriptions] = useState([]); // Abonelikler

  // Dark mode toggle fonksiyonu
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    // HTML element'ine dark class'ını ekle/çıkar
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // localStorage'dan veri yükleme ve online durumu izleme
  useEffect(() => {
    const loadData = () => {
      try {
        // Profil listesini yükle
        const savedProfiles = localStorage.getItem('profiles');
        if (savedProfiles) setProfiles(JSON.parse(savedProfiles));
        
        // Aktif profili yükle
        const savedCurrentProfile = localStorage.getItem('currentProfile');
        if (savedCurrentProfile) setCurrentProfile(savedCurrentProfile);
        
        // Dark mode ayarını yükle ve HTML'e uygula
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode) {
          const darkModeValue = JSON.parse(savedDarkMode);
          setDarkMode(darkModeValue);
          if (darkModeValue) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        
        // Başlık yükle
        const savedTitle = localStorage.getItem('appTitle');
        if (savedTitle) setAppTitle(savedTitle);
        
        // Aktif profile göre verileri yükle
        const profileKey = savedCurrentProfile || 'default';
        const savedProjects = localStorage.getItem(`projects_${profileKey}`);
        const savedIncomes = localStorage.getItem(`incomes_${profileKey}`);
        const savedExpenses = localStorage.getItem(`expenses_${profileKey}`);
        const savedTaxPayments = localStorage.getItem(`taxPayments_${profileKey}`);
        const savedAgenda = localStorage.getItem(`agenda_${profileKey}`);
        const savedRegularExpenses = localStorage.getItem(`regularExpenses_${profileKey}`);
        const savedSubscriptions = localStorage.getItem(`subscriptions_${profileKey}`);

        if (savedProjects) setProjects(JSON.parse(savedProjects));
        if (savedIncomes) setIncomes(JSON.parse(savedIncomes));
        if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
        if (savedTaxPayments) setTaxPayments(JSON.parse(savedTaxPayments));
        if (savedAgenda) setAgenda(JSON.parse(savedAgenda));
        if (savedRegularExpenses) setRegularExpenses(JSON.parse(savedRegularExpenses));
        if (savedSubscriptions) setSubscriptions(JSON.parse(savedSubscriptions));
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
      }
    };

    loadData();

    // Online/offline durumu izleme
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Profil değişikliğinde verileri yükle
  useEffect(() => {
    const loadProfileData = () => {
      try {
        const savedProjects = localStorage.getItem(`projects_${currentProfile}`);
        const savedIncomes = localStorage.getItem(`incomes_${currentProfile}`);
        const savedExpenses = localStorage.getItem(`expenses_${currentProfile}`);
        const savedTaxPayments = localStorage.getItem(`taxPayments_${currentProfile}`);
        const savedRegularExpenses = localStorage.getItem(`regularExpenses_${currentProfile}`);
        const savedSubscriptions = localStorage.getItem(`subscriptions_${currentProfile}`);

        // Varsayılan veriler kaldırıldı - temiz başlangıç için

        const defaultAgenda = [
          {
            id: 'agenda-1',
            date: '2025-01-15',
            title: 'ABC Teknoloji Proje Teslimi',
            note: 'Kurumsal web sitesi final teslimi, eğitim ve belgelendirme',
            priority: 'yuksek'
          },
          {
            id: 'agenda-2',
            date: '2025-01-20',
            title: 'Vergi Beyannamesi',
            note: 'Ocak ayı gelir vergisi ve KDV beyan süresi',
            priority: 'orta'
          },
          {
            id: 'agenda-3',
            date: '2025-01-25',
            title: 'DEF Şirket Toplantısı',
            note: 'Mobil uygulama projesinin detayları ve timeline görüşmesi',
            priority: 'yuksek'
          },
          {
            id: 'agenda-4',
            date: '2025-02-01',
            title: 'Portfolio Sitesi Güncellemesi',
            note: 'Yeni projelerle portfolio sayfasını güncelleme',
            priority: 'dusuk'
          },
          {
            id: 'agenda-5',
            date: '2025-01-10',
            title: 'MNO Ltd. Revizyon Sunumu',
            note: 'CRM sistemi revizyon değişiklikleri ve demo',
            priority: 'orta'
          },
          {
            id: 'agenda-6',
            date: '2025-01-30',
            title: 'Aylık Muhasebe Kapanışı',
            note: 'Ocak ayı gelir-gider kayıtları ve raporlama',
            priority: 'orta'
          }
        ];

        // Veri yükleme - varsayılan veriler kaldırıldı, temiz başlangıç
        if (savedProjects) {
          setProjects(JSON.parse(savedProjects));
        } else {
          setProjects([]); // Boş başla
        }
        
        if (savedIncomes) {
          setIncomes(JSON.parse(savedIncomes));
        } else {
          setIncomes([]); // Boş başla
        }
        
        if (savedExpenses) {
          setExpenses(JSON.parse(savedExpenses));
        } else {
          setExpenses([]); // Boş başla
        }
        
        if (savedTaxPayments) {
          setTaxPayments(JSON.parse(savedTaxPayments));
        } else {
          setTaxPayments([]); // Boş başla
        }
        
        if (savedRegularExpenses) {
          setRegularExpenses(JSON.parse(savedRegularExpenses));
        } else {
          setRegularExpenses([]); // Boş başla
        }
        
        if (savedSubscriptions) {
          setSubscriptions(JSON.parse(savedSubscriptions));
        } else {
          setSubscriptions([]); // Boş başla
        }
        
        const savedAgenda = localStorage.getItem(`agenda_${profileKey}`);
        if (!savedAgenda) {
          setAgenda(defaultAgenda);
          localStorage.setItem(`agenda_${profileKey}`, JSON.stringify(defaultAgenda));
        } else {
          setAgenda(JSON.parse(savedAgenda));
        }
      } catch (error) {
        console.error('Profil verileri yüklenirken hata:', error);
      }
    };

    loadProfileData();
  }, [currentProfile]);

  // Düzenli giderler için dönem değişikliği takibi
  useEffect(() => {
    const currentDate = new Date();
    const currentPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    // Mevcut dönem için düzenli giderler var mı kontrol et
    const currentPeriodExpenses = regularExpenses.filter(expense => expense.period === currentPeriod);
    
    if (currentPeriodExpenses.length === 0 && regularExpenses.length > 0) {
      resetAndAddRegularExpensesForNewPeriod();
    }
  }, [dashboardFilter.year, dashboardFilter.month, regularExpenses]);

  // Verileri localStorage'a kaydetme (profile göre)
  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(`${key}_${currentProfile}`, JSON.stringify(data));
    } catch (error) {
      console.error('Veri kaydedilirken hata:', error);
    }
  };

  // Test profili fonksiyonu kaldırıldı - varsayılan veriler kullanılıyor

  // Profil yönetimi
  const addProfile = (profileName) => {
    if (profileName && !profiles.includes(profileName)) {
      const updatedProfiles = [...profiles, profileName];
      setProfiles(updatedProfiles);
      localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
      setCurrentProfile(profileName);
      localStorage.setItem('currentProfile', profileName);
      setShowProfileForm(false);
    }
  };

  const deleteProfile = (profileName) => {
    if (profileName !== 'default' && profiles.length > 1) {
      const updatedProfiles = profiles.filter(p => p !== profileName);
      setProfiles(updatedProfiles);
      localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
      
      // Profil verilerini sil
      localStorage.removeItem(`projects_${profileName}`);
      localStorage.removeItem(`incomes_${profileName}`);
      localStorage.removeItem(`expenses_${profileName}`);
      localStorage.removeItem(`taxPayments_${profileName}`);
      localStorage.removeItem(`regularExpenses_${profileName}`);
      
      // Default profile geç
      if (currentProfile === profileName) {
        setCurrentProfile('default');
        localStorage.setItem('currentProfile', 'default');
      }
    }
  };

  const clearCurrentProfile = () => {
    if (window.confirm(`"${currentProfile}" profilindeki tüm verileri silmek istediğinizden emin misiniz?`)) {
      setProjects([]);
      setIncomes([]);
      setExpenses([]);
      setTaxPayments([]);
      setAgenda([]);
      setRegularExpenses([]);
      setSubscriptions([]);
      saveToStorage('projects', []);
      saveToStorage('incomes', []);
      saveToStorage('expenses', []);
      saveToStorage('taxPayments', []);
      saveToStorage('agenda', []);
      saveToStorage('regularExpenses', []);
      saveToStorage('subscriptions', []);
    }
  };

  // Profil ismini değiştirme
  const renameProfile = (oldName, newName) => {
    if (!newName || newName.trim() === '' || profiles.includes(newName)) {
      alert('Geçersiz profil adı veya bu isim zaten kullanılıyor!');
      return false;
    }

    if (oldName === 'default' && newName !== 'default') {
      alert('Varsayılan profil adı değiştirilemez!');
      return false;
    }

    const trimmedNewName = newName.trim();
    
    // Profil listesini güncelle
    const updatedProfiles = profiles.map(p => p === oldName ? trimmedNewName : p);
    setProfiles(updatedProfiles);
    localStorage.setItem('profiles', JSON.stringify(updatedProfiles));

    // Eski profil verilerini al
    const oldProjectsData = localStorage.getItem(`projects_${oldName}`);
    const oldIncomesData = localStorage.getItem(`incomes_${oldName}`);
    const oldExpensesData = localStorage.getItem(`expenses_${oldName}`);
    const oldTaxPaymentsData = localStorage.getItem(`taxPayments_${oldName}`);
    const oldAgendaData = localStorage.getItem(`agenda_${oldName}`);
    const oldRegularExpensesData = localStorage.getItem(`regularExpenses_${oldName}`);
    const oldSubscriptionsData = localStorage.getItem(`subscriptions_${oldName}`);

    // Yeni isimle kaydet
    if (oldProjectsData) localStorage.setItem(`projects_${trimmedNewName}`, oldProjectsData);
    if (oldIncomesData) localStorage.setItem(`incomes_${trimmedNewName}`, oldIncomesData);
    if (oldExpensesData) localStorage.setItem(`expenses_${trimmedNewName}`, oldExpensesData);
    if (oldTaxPaymentsData) localStorage.setItem(`taxPayments_${trimmedNewName}`, oldTaxPaymentsData);
    if (oldAgendaData) localStorage.setItem(`agenda_${trimmedNewName}`, oldAgendaData);
    if (oldRegularExpensesData) localStorage.setItem(`regularExpenses_${trimmedNewName}`, oldRegularExpensesData);
    if (oldSubscriptionsData) localStorage.setItem(`subscriptions_${trimmedNewName}`, oldSubscriptionsData);

    // Eski verileri sil (default hariç)
    if (oldName !== 'default') {
      localStorage.removeItem(`projects_${oldName}`);
      localStorage.removeItem(`incomes_${oldName}`);
      localStorage.removeItem(`expenses_${oldName}`);
      localStorage.removeItem(`taxPayments_${oldName}`);
      localStorage.removeItem(`agenda_${oldName}`);
      localStorage.removeItem(`regularExpenses_${oldName}`);
      localStorage.removeItem(`subscriptions_${oldName}`);
    }

    // Aktif profil güncelle
    if (currentProfile === oldName) {
      setCurrentProfile(trimmedNewName);
      localStorage.setItem('currentProfile', trimmedNewName);
    }

    return true;
  };

  // Genel filtreleme fonksiyonu
  const filterDataByPeriod = (data, dateField, filterState) => {
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      
      if (filterState.type === 'month') {
        return itemDate.getMonth() === filterState.month && 
               itemDate.getFullYear() === filterState.year;
      } else if (filterState.type === 'year') {
        return itemDate.getFullYear() === filterState.year;
      } else if (filterState.type === 'all') {
        return true; // Tüm zamanlar - hepsini göster
      }
      
      return true;
    });
  };

  const dashboardSummary = useMemo(() => {
    // Filtrelenmiş verileri al
    const filteredIncomes = filterDataByPeriod(incomes, 'income_date', dashboardFilter);
    const filteredExpenses = filterDataByPeriod(expenses, 'expense_date', dashboardFilter);
    const filteredTaxPayments = filterDataByPeriod(taxPayments, 'payment_date', dashboardFilter);
    
    // Mevcut döneme ait düzenli giderleri ve abonelikleri filtrele
    const currentPeriod = `${dashboardFilter.year}-${String(dashboardFilter.month + 1).padStart(2, '0')}`;
    const filteredRegularExpenses = regularExpenses.filter(expense => expense.period === currentPeriod);
    const filteredSubscriptions = subscriptions.filter(subscription => subscription.period === currentPeriod);
    
    const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
    const baseExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const regularExpensesTotal = filteredRegularExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const subscriptionsTotal = filteredSubscriptions.reduce((sum, subscription) => sum + subscription.amount, 0);
    const totalTaxPaid = filteredTaxPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Gelirlerden çıkan KDV'yi hesapla (vergi ödemelerine otomatik olarak ekleniyor)
    const totalVATFromIncomes = filteredIncomes.reduce((sum, income) => sum + (income.tax_amount || 0), 0);
    
    // Toplam giderler: Normal giderler + Düzenli giderler + Abonelikler + Vergi ödemeleri (KDV dahil)
    const totalExpenses = baseExpenses + regularExpensesTotal + subscriptionsTotal + totalTaxPaid;
    
    // Projeler için özel filtreleme - sadece aktif projeleri say (tamamlanan hariç)
    const filteredProjects = filterDataByPeriod(projects, 'start_date', dashboardFilter);
    const activeProjects = filteredProjects.filter(p => 
      p.status !== 'tamamlandi' && 
      (p.status === 'devam-ediyor' || p.status === 'teklif-iletildi')
    ).length;
    
    return {
      totalIncome,
      totalExpenses,
      baseExpenses, // Normal giderler
      regularExpensesTotal, // Düzenli giderler
      subscriptionsTotal, // Abonelikler
      totalVATFromIncomes, // Gelirlerden gelen KDV (artık vergi ödemelerinde)
      netProfit: totalIncome - totalExpenses, // Net kar
      totalTaxPaid,
      activeProjects,
      filteredIncomes,
      filteredExpenses,
      filteredTaxPayments,
      filteredRegularExpenses,
      filteredSubscriptions,
      filteredProjects,
      period: dashboardFilter
    };
  }, [incomes, expenses, taxPayments, regularExpenses, subscriptions, projects, dashboardFilter]);

  // Yeni proje ekleme
  const addProject = (projectData) => {
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      created_at: new Date().toISOString()
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveToStorage('projects', updatedProjects);
    setShowForm(null);
  };

  // Proje güncelleme
  const updateProject = (updatedProject) => {
    const updatedProjects = projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    );
    setProjects(updatedProjects);
    saveToStorage('projects', updatedProjects);
    setEditItem(null);
  };

  // Proje silme
  const deleteProject = (projectId) => {
    if (window.confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      saveToStorage('projects', updatedProjects);
    }
  };

  // Yeni gelir ekleme
  const addIncome = (incomeData) => {
    const newIncome = {
      id: Date.now().toString(),
      ...incomeData,
      created_at: new Date().toISOString()
    };
    const updatedIncomes = [...incomes, newIncome];
    setIncomes(updatedIncomes);
    saveToStorage('incomes', updatedIncomes);
    
    // Eğer KDV varsa, otomatik olarak vergi ödemelerine ekle
    if (incomeData.tax_amount && incomeData.tax_amount > 0) {
      const vatPayment = {
        id: `vat_${Date.now()}`,
        amount: incomeData.tax_amount,
        type: 'KDV',
        payment_date: incomeData.income_date,
        description: `${incomeData.description} - Otomatik KDV`
      };
      
      const updatedTaxPayments = [...taxPayments, vatPayment];
      setTaxPayments(updatedTaxPayments);
      saveToStorage('taxPayments', updatedTaxPayments);
    }
    
    setShowForm(null);
  };

  // Gelir güncelleme
  const updateIncome = (updatedIncome) => {
    const updatedIncomes = incomes.map(i => 
      i.id === updatedIncome.id ? updatedIncome : i
    );
    setIncomes(updatedIncomes);
    saveToStorage('incomes', updatedIncomes);
    setEditItem(null);
  };

  // Gelir silme
  const deleteIncome = (incomeId) => {
    if (window.confirm('Bu geliri silmek istediğinizden emin misiniz?')) {
      const updatedIncomes = incomes.filter(i => i.id !== incomeId);
      setIncomes(updatedIncomes);
      saveToStorage('incomes', updatedIncomes);
    }
  };

  // Yeni gider ekleme
  const addExpense = (expenseData) => {
    const newExpense = {
      id: Date.now().toString(),
      ...expenseData,
      created_at: new Date().toISOString()
    };
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    saveToStorage('expenses', updatedExpenses);
    setShowForm(null);
  };

  // Gider güncelleme
  const updateExpense = (updatedExpense) => {
    const updatedExpenses = expenses.map(e => 
      e.id === updatedExpense.id ? updatedExpense : e
    );
    setExpenses(updatedExpenses);
    saveToStorage('expenses', updatedExpenses);
    setEditItem(null);
  };

  // Gider silme
  const deleteExpense = (expenseId) => {
    if (window.confirm('Bu gideri silmek istediğinizden emin misiniz?')) {
      const updatedExpenses = expenses.filter(e => e.id !== expenseId);
      setExpenses(updatedExpenses);
      saveToStorage('expenses', updatedExpenses);
    }
  };

  // Yeni vergi ödemesi ekleme
  const addTaxPayment = (taxData) => {
    const newTaxPayment = {
      id: Date.now().toString(),
      ...taxData,
      created_at: new Date().toISOString()
    };
    const updatedTaxPayments = [...taxPayments, newTaxPayment];
    setTaxPayments(updatedTaxPayments);
    saveToStorage('taxPayments', updatedTaxPayments);
    setShowForm(null);
  };

  // Vergi ödemesi güncelleme
  const updateTaxPayment = (updatedTaxPayment) => {
    const updatedTaxPayments = taxPayments.map(t => 
      t.id === updatedTaxPayment.id ? updatedTaxPayment : t
    );
    setTaxPayments(updatedTaxPayments);
    saveToStorage('taxPayments', updatedTaxPayments);
    setEditItem(null);
  };

  // Vergi ödemesi silme
  const deleteTaxPayment = (taxId) => {
    if (window.confirm('Bu vergi ödemesini silmek istediğinizden emin misiniz?')) {
      const updatedTaxPayments = taxPayments.filter(t => t.id !== taxId);
      setTaxPayments(updatedTaxPayments);
      saveToStorage('taxPayments', updatedTaxPayments);
    }
  };

  // Profil Export/Import fonksiyonları - Tüm profil verileri
  const exportProfileToJSON = () => {
    const allProfilesData = {};
    
    // Tüm profillerin verilerini topla
    profiles.forEach(profileName => {
      const profileProjects = localStorage.getItem(`projects_${profileName}`);
      const profileIncomes = localStorage.getItem(`incomes_${profileName}`);
      const profileExpenses = localStorage.getItem(`expenses_${profileName}`);
      const profileTaxPayments = localStorage.getItem(`taxPayments_${profileName}`);
      const profileAgenda = localStorage.getItem(`agenda_${profileName}`);
      const profileRegularExpenses = localStorage.getItem(`regularExpenses_${profileName}`);
      const profileSubscriptions = localStorage.getItem(`subscriptions_${profileName}`);
      
      allProfilesData[profileName] = {
        projects: profileProjects ? JSON.parse(profileProjects) : [],
        incomes: profileIncomes ? JSON.parse(profileIncomes) : [],
        expenses: profileExpenses ? JSON.parse(profileExpenses) : [],
        tax_payments: profileTaxPayments ? JSON.parse(profileTaxPayments) : [],
        agenda: profileAgenda ? JSON.parse(profileAgenda) : [],
        regular_expenses: profileRegularExpenses ? JSON.parse(profileRegularExpenses) : [],
        subscriptions: profileSubscriptions ? JSON.parse(profileSubscriptions) : []
      };
    });
    
    const data = {
      exported_at: new Date().toISOString(),
      version: "1.1",
      profiles: profiles,
      current_profile: currentProfile,
      app_title: appTitle,
      all_data: allProfilesData
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freelancer-finans-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Tüm veriler başarıyla dışa aktarıldı!');
  };

  const importProfileFromJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Veri yapısını kontrol et
        if (importedData.all_data && importedData.profiles) {
          // Tüm profilleri ve verilerini içe aktar
          const { profiles: importedProfiles, all_data, current_profile, app_title } = importedData;
          
          // Profilleri güncelle
          const mergedProfiles = [...new Set([...profiles, ...importedProfiles])];
          setProfiles(mergedProfiles);
          localStorage.setItem('profiles', JSON.stringify(mergedProfiles));
          
          // Uygulama başlığını güncelle (varsa)
          if (app_title) {
            setAppTitle(app_title);
            localStorage.setItem('appTitle', app_title);
          }
          
          // Her profil için verileri kaydet
          Object.entries(all_data).forEach(([profileName, profileData]) => {
            if (profileData.projects) {
              localStorage.setItem(`projects_${profileName}`, JSON.stringify(profileData.projects));
            }
            if (profileData.incomes) {
              localStorage.setItem(`incomes_${profileName}`, JSON.stringify(profileData.incomes));
            }
            if (profileData.expenses) {
              localStorage.setItem(`expenses_${profileName}`, JSON.stringify(profileData.expenses));
            }
            if (profileData.tax_payments) {
              localStorage.setItem(`taxPayments_${profileName}`, JSON.stringify(profileData.tax_payments));
            }
            if (profileData.agenda) {
              localStorage.setItem(`agenda_${profileName}`, JSON.stringify(profileData.agenda));
            }
            if (profileData.regular_expenses) {
              localStorage.setItem(`regularExpenses_${profileName}`, JSON.stringify(profileData.regular_expenses));
            }
            if (profileData.subscriptions) {
              localStorage.setItem(`subscriptions_${profileName}`, JSON.stringify(profileData.subscriptions));
            }
          });
          
          // Aktif profili değiştir
          if (current_profile && mergedProfiles.includes(current_profile)) {
            setCurrentProfile(current_profile);
            localStorage.setItem('currentProfile', current_profile);
          }
          
          alert(`Tüm veriler başarıyla içe aktarıldı!\nProfiller: ${importedProfiles.join(', ')}\nVersiyon: ${importedData.version || '1.0'}`);
          
          // Sayfayı yenile ki yeni veriler görünsün
          window.location.reload();
        } else {
          alert('Geçersiz dosya formatı! Freelancer Finans yedek dosyası seçin.');
        }
      } catch (error) {
        console.error('İçe aktarma hatası:', error);
        alert('Dosya okuma hatası! Lütfen geçerli bir JSON dosyası seçin.');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Input'u temizle
  };

  // Ajanda yönetimi
  const addAgendaItem = (agendaData) => {
    const newAgendaItem = {
      id: Date.now().toString(),
      ...agendaData
    };
    const updatedAgenda = [...agenda, newAgendaItem];
    setAgenda(updatedAgenda);
    saveToStorage('agenda', updatedAgenda);
  };

  const updateAgendaItem = (id, updatedData) => {
    const updatedAgenda = agenda.map(item =>
      item.id === id ? { ...item, ...updatedData } : item
    );
    setAgenda(updatedAgenda);
    saveToStorage('agenda', updatedAgenda);
  };

  const deleteAgendaItem = (id) => {
    if (window.confirm('Bu ajanda kaydını silmek istediğinizden emin misiniz?')) {
      const updatedAgenda = agenda.filter(item => item.id !== id);
      setAgenda(updatedAgenda);
      saveToStorage('agenda', updatedAgenda);
    }
  };

  // Düzenli giderler yönetimi
  const addRegularExpense = (expenseData) => {
    const currentDate = new Date();
    const currentPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    const newExpense = {
      id: Date.now().toString(),
      ...expenseData,
      period: currentPeriod // Mevcut döneme göre otomatik atama
    };
    
    // Sadece düzenli giderler listesine ekle
    const updatedRegular = [...regularExpenses, newExpense];
    setRegularExpenses(updatedRegular);
    saveToStorage('regularExpenses', updatedRegular);
  };

  const updateRegularExpense = (id, updatedData) => {
    const updated = regularExpenses.map(expense =>
      expense.id === id ? { ...expense, ...updatedData } : expense
    );
    setRegularExpenses(updated);
    saveToStorage('regularExpenses', updated);
  };

  const deleteRegularExpense = (id) => {
    // Sadece düzenli giderler listesinden sil
    const updatedRegular = regularExpenses.filter(expense => expense.id !== id);
    setRegularExpenses(updatedRegular);
    saveToStorage('regularExpenses', updatedRegular);
  };

  // Abonelik yönetimi
  const addSubscription = (subscriptionData) => {
    const currentDate = new Date();
    const currentPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    const newSubscription = {
      id: Date.now().toString(),
      ...subscriptionData,
      period: currentPeriod
    };
    
    const updatedSubscriptions = [...subscriptions, newSubscription];
    setSubscriptions(updatedSubscriptions);
    saveToStorage('subscriptions', updatedSubscriptions);
  };

  const deleteSubscription = (id) => {
    const updatedSubscriptions = subscriptions.filter(sub => sub.id !== id);
    setSubscriptions(updatedSubscriptions);
    saveToStorage('subscriptions', updatedSubscriptions);
  };

  // Düzenli giderleri yeni dönem için otomatik sıfırlama ve ekleme
  const resetAndAddRegularExpensesForNewPeriod = () => {
    const currentDate = new Date();
    const currentPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    // Mevcut döneme ait düzenli giderler var mı kontrol et
    const currentPeriodExpenses = regularExpenses.filter(expense => expense.period === currentPeriod);
    
    if (currentPeriodExpenses.length === 0) {
      // Önceki dönemlerin düzenli giderlerini al ve yeni döneme kopyala
      const previousPeriodExpenses = regularExpenses.filter(expense => expense.period !== currentPeriod);
      
      if (previousPeriodExpenses.length > 0) {
        // En son dönemin düzenli giderlerini al
        const latestPeriod = previousPeriodExpenses.reduce((latest, expense) => 
          expense.period > latest ? expense.period : latest, ''
        );
        const latestExpenses = previousPeriodExpenses.filter(expense => expense.period === latestPeriod);
        
        // Yeni dönem için otomatik olarak ekle
        latestExpenses.forEach(expense => {
          const newExpense = {
            ...expense,
            id: Date.now().toString() + Math.random(),
            period: currentPeriod
          };
          
          // Düzenli giderler listesine ekle
          const updatedRegular = [...regularExpenses, newExpense];
          setRegularExpenses(updatedRegular);
          saveToStorage('regularExpenses', updatedRegular);
          
          // Ana giderler listesine de ekle
          const mainExpense = {
            id: `main_${newExpense.id}`,
            amount: expense.amount,
            category: expense.category,
            description: `${expense.amount} TL ${expense.category}`,
            expense_date: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-01`,
            created_at: new Date().toISOString()
          };
          
          const updatedExpenses = [...expenses, mainExpense];
          setExpenses(updatedExpenses);
          saveToStorage('expenses', updatedExpenses);
        });
      }
    }
  };

  // Başlık düzenleme
  const updateTitle = (newTitle) => {
    setAppTitle(newTitle);
    localStorage.setItem('appTitle', newTitle);
    setIsEditingTitle(false);
  };

  // Dönem Filtresi Bileşeni
  const PeriodFilter = ({ filter, setFilter, label }) => {
    const goToToday = () => {
      const today = new Date();
      setFilter({
        type: 'month',
        year: today.getFullYear(),
        month: today.getMonth()
      });
    };
    
    return (
      <div className="flex items-center gap-2">
        <label className={`text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>{label}:</label>
        
        {/* Tür Seçimi */}
        <select
          value={filter.type}
          onChange={(e) => setFilter({...filter, type: e.target.value})}
          className={`px-2 py-2 h-10 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="month">Aylık</option>
          <option value="year">Yıllık</option>
          <option value="all">Tüm Zamanlar</option>
        </select>
        
        {/* Yıl - Sadece aylık veya yıllık seçildiğinde */}
        {(filter.type === 'month' || filter.type === 'year') && (
          <select
            value={filter.year}
            onChange={(e) => setFilter({...filter, year: parseInt(e.target.value)})}
            className={`px-2 py-2 h-10 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {Array.from({length: 10}, (_, i) => currentYear + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        )}
        
        {/* Ay - Sadece aylık seçildiğinde */}
        {filter.type === 'month' && (
          <select
            value={filter.month}
            onChange={(e) => setFilter({...filter, month: parseInt(e.target.value)})}
            className={`px-2 py-2 h-10 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
              'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'].map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
        )}
        
        {/* Bugüne Git Butonu */}
        <button
          onClick={goToToday}
          className={`px-3 py-2 h-10 rounded-md border transition-colors duration-200 hover:scale-110 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
              : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
          }`}
          title="Bugüne git"
        >
          📅
        </button>
      </div>
    );
  };

  // Form bileşenleri
  const ProjectForm = ({ project = null }) => {
    const [formData, setFormData] = useState({
      status: project?.status || 'teklif-iletildi',
      name: project?.name || '',
      description: project?.description || '',
      start_date: project?.start_date || new Date().toISOString().split('T')[0],
      price: project?.price || ''
    });

    const statuses = {
      'teklif-iletildi': 'Teklif İletildi',
      'devam-ediyor': 'Devam Ediyor',
      'revizyonda': 'Revizyonda',
      'tamamlandi': 'Tamamlandı',
      'iptal-edildi': 'İptal Edildi'
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const projectData = {
        ...formData,
        price: parseFloat(formData.price) || 0
      };
      
      if (project) {
        updateProject({ ...project, ...projectData });
      } else {
        addProject(projectData);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">
          {project ? 'Proje Düzenle' : 'Yeni Proje Ekle'}
        </h3>
        
        {/* Tarih - En üstte */}
        <DateInput
          value={formData.start_date}
          onChange={(e) => setFormData({...formData, start_date: e.target.value})}
          required={true}
          label="Proje Başlangıç Tarihi"
        />
        
        {/* Durum */}
        <select
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          {Object.entries(statuses).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Proje Adı"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        />
        <textarea
          placeholder="Proje Açıklaması"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        <input
          type="number"
          placeholder="Fiyat (₺)"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        <div className="flex gap-4">
          <StandardButton type="submit" variant="primary">
            {project ? 'Güncelle' : 'Kaydet'}
          </StandardButton>
          <StandardButton
            variant="secondary"
            onClick={() => {
              setShowForm(null);
              setEditItem(null);
            }}
          >
            İptal
          </StandardButton>
        </div>
      </form>
    );
  };

  const IncomeForm = ({ income = null }) => {
    const [formData, setFormData] = useState({
      brand: income?.brand || '',
      project_id: income?.project_id || '',
      description: income?.description || '',
      amount: income?.amount || '',
      vat_rate: income?.vat_rate || 0.18, // KDV oranı
      income_date: income?.income_date || new Date().toISOString().split('T')[0]
    });

    const calculateAmounts = (amount, vatRate) => {
      const baseAmount = parseFloat(amount) || 0;
      const vatAmount = baseAmount * vatRate;
      const netAmount = baseAmount - vatAmount;
      return { baseAmount, vatAmount, netAmount };
    };

    const { baseAmount, vatAmount, netAmount } = calculateAmounts(formData.amount, formData.vat_rate);

    const handleSubmit = (e) => {
      e.preventDefault();
      const amount = parseFloat(formData.amount) || 0;
      const vatRate = parseFloat(formData.vat_rate) || 0;
      const vatAmount = amount * vatRate;
      const netAmount = amount - vatAmount;
      
      const incomeData = {
        ...formData,
        amount,
        vat_rate: vatRate,
        tax_amount: vatAmount,
        net_amount: netAmount
      };
      
      if (income) {
        updateIncome({ ...income, ...incomeData });
      } else {
        addIncome(incomeData);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">
          {income ? 'Gelir Düzenle' : 'Yeni Gelir Ekle'}
        </h3>
        
        {/* Tarih - En üstte */}
        <DateInput
          value={formData.income_date}
          onChange={(e) => setFormData({...formData, income_date: e.target.value})}
          required={true}
          label="Gelir Tarihi"
        />
        
        {/* Marka */}
        <input
          type="text"
          placeholder="Marka"
          value={formData.brand}
          onChange={(e) => setFormData({...formData, brand: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        
        {/* Proje Seçimi - Opsiyonel */}
        <select
          value={formData.project_id}
          onChange={(e) => setFormData({...formData, project_id: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="">-- Proje seçilmemiş --</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Gelir Açıklaması"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        <input
          type="number"
          placeholder="Tutar (₺)"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        
        {/* KDV Oranı Seçimi */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium transition-colors duration-200 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>KDV Oranı</label>
          <select
            value={formData.vat_rate}
            onChange={(e) => setFormData({...formData, vat_rate: parseFloat(e.target.value)})}
            className={`w-full p-3 border rounded-md transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value={0}>%0 (KDV Yok)</option>
            <option value={0.01}>%1</option>
            <option value={0.08}>%8</option>
            <option value={0.18}>%18</option>
            <option value={0.20}>%20</option>
          </select>
        </div>
        
        {/* KDV Hesaplama Gösterimi */}
        {formData.amount && (
          <div className={`p-4 rounded-md space-y-2 transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-gray-50'
          }`}>
            <div className={`flex justify-between text-sm transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <span>Ana Tutar:</span>
              <span className="font-semibold">₺{baseAmount.toLocaleString('tr-TR')}</span>
            </div>
            <div className={`flex justify-between text-sm transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <span>KDV ({(formData.vat_rate * 100).toFixed(0)}%):</span>
              <span className="font-semibold text-red-500">₺{vatAmount.toLocaleString('tr-TR')}</span>
            </div>
            <div className={`flex justify-between text-sm border-t pt-2 transition-colors duration-200 ${
              darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-700'
            }`}>
              <span className="font-semibold">Net Tutar:</span>
              <span className="font-bold text-green-500">₺{netAmount.toLocaleString('tr-TR')}</span>
            </div>
          </div>
        )}
        <div className="flex gap-4">
          <StandardButton type="submit" variant="success">
            {income ? 'Güncelle' : 'Kaydet'}
          </StandardButton>
          <StandardButton
            variant="secondary"
            onClick={() => {
              setShowForm(null);
              setEditItem(null);
            }}
          >
            İptal
          </StandardButton>
        </div>
      </form>
    );
  };

  const ExpenseForm = ({ expense = null }) => {
    const [formData, setFormData] = useState({
      category: expense?.category || 'ofis-giderleri',
      description: expense?.description || '',
      expense_date: expense?.expense_date || new Date().toISOString().split('T')[0],
      amount: expense?.amount || ''
    });

    const categories = {
      'ofis-giderleri': 'Ofis Giderleri',
      'donanim': 'Donanım',
      'pazarlama': 'Pazarlama',
      'ulasim': 'Ulaşım',
      'egitim': 'Eğitim',
      'proje-bazli': 'Proje Bazlı Harcamalar',
      'yemek': 'Yemek',
      'diger': 'Diğer'
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      if (expense) {
        updateExpense({ ...expense, ...expenseData });
      } else {
        addExpense(expenseData);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">
          {expense ? 'Gider Düzenle' : 'Yeni Gider Ekle'}
        </h3>
        
        {/* Tarih - En üstte */}
        <DateInput
          value={formData.expense_date}
          onChange={(e) => setFormData({...formData, expense_date: e.target.value})}
          required={true}
          label="Gider Tarihi"
        />
        
        {/* Kategori - Manual + Dropdown */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Kategori girin..."
            value={Object.values(categories).find(label => categories[Object.keys(categories).find(key => categories[key] === label && key === formData.category)]) || formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className={`flex-1 p-3 border rounded-md transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className={`p-3 border rounded-md transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Seçin...</option>
            {Object.entries(categories)
              .filter(([key]) => key !== 'diger')
              .sort(([, a], [, b]) => a.localeCompare(b, 'tr'))
              .map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))
            }
            <option key="diger" value="diger">Diğer</option>
          </select>
        </div>
        
        <input
          type="text"
          placeholder="Açıklama"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        
        {/* Tutar - En altta */}
        <input
          type="number"
          placeholder="Tutar (₺)"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        />
        
        <div className="flex gap-4">
          <StandardButton type="submit" variant="danger">
            {expense ? 'Güncelle' : 'Kaydet'}
          </StandardButton>
          <StandardButton
            variant="secondary"
            onClick={() => {
              setShowForm(null);
              setEditItem(null);
            }}
          >
            İptal
          </StandardButton>
        </div>
      </form>
    );
  };

  const TaxPaymentForm = ({ taxPayment = null }) => {
    const [formData, setFormData] = useState({
      amount: taxPayment?.amount || '',
      type: taxPayment?.type || 'KDV',
      payment_date: taxPayment?.payment_date || new Date().toISOString().split('T')[0],
      description: taxPayment?.description || ''
    });

    const taxTypes = {
      'KDV': 'KDV',
      'Damga Vergisi': 'Damga Vergisi',
      'Stopaj': 'Stopaj',
      'BAĞ-KUR': 'BAĞ-KUR',
      'Geçici Vergi': 'Geçici Vergi'
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const taxData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      if (taxPayment) {
        updateTaxPayment({ ...taxPayment, ...taxData });
      } else {
        addTaxPayment(taxData);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">
          {taxPayment ? 'Vergi Ödemesi Düzenle' : 'Vergi Ödemesi Ekle'}
        </h3>
        
        {/* Tarih Seçimi - İlk sıra */}
        <DateInput
          value={formData.payment_date}
          onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
          required={true}
          label="Ödeme Tarihi"
        />
        
        {/* Vergi Türü (KDV, Damga Vergisi gibi) - İkinci sıra */}
        <select
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        >
          {Object.entries(taxTypes).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        
        {/* Açıklama - Üçüncü sıra */}
        <textarea
          placeholder="Açıklama"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        
        {/* Vergi Tutarı - Son sıra */}
        <input
          type="number"
          placeholder="Ödenen Vergi Tutarı (₺)"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        />
        <div className="flex gap-4">
          <StandardButton type="submit" variant="primary">
            {taxPayment ? 'Güncelle' : 'Kaydet'}
          </StandardButton>
          <StandardButton
            variant="secondary"
            onClick={() => {
              setShowForm(null);
              setEditItem(null);
            }}
          >
            İptal
          </StandardButton>
        </div>
      </form>
    );
  };

  const AgendaForm = ({ agendaItem = null }) => {
    const [formData, setFormData] = useState({
      title: agendaItem?.title || '',
      note: agendaItem?.note || '',
      date: agendaItem?.date || new Date().toISOString().split('T')[0],
      priority: agendaItem?.priority || 'orta'
    });

    const priorities = {
      'dusuk': 'Düşük',
      'orta': 'Orta',
      'yuksek': 'Yüksek'
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (agendaItem) {
        updateAgendaItem(agendaItem.id, formData);
        setEditItem(null);
      } else {
        addAgendaItem(formData);
        setShowForm(null);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {agendaItem ? 'Ajanda Notu Düzenle' : 'Yeni Ajanda Notu Ekle'}
        </h3>
        
        {/* Tarih - En üstte */}
        <DateInput
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          required={true}
          label="Ajanda Tarihi"
        />
        
        {/* Önem Derecesi - İkinci sırada */}
        <select
          value={formData.priority}
          onChange={(e) => setFormData({...formData, priority: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          {Object.entries(priorities).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        
        {/* Başlık - Üçüncü sırada */}
        <input
          type="text"
          placeholder="Başlık"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        />
        
        {/* Not - En altta */}
        <textarea
          placeholder="Not"
          value={formData.note}
          onChange={(e) => setFormData({...formData, note: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          rows="3"
        />
        
        <div className="flex gap-4">
          <StandardButton type="submit" variant="primary">
            {agendaItem ? 'Güncelle' : 'Kaydet'}
          </StandardButton>
          <StandardButton
            variant="secondary"
            onClick={() => {
              setShowForm(null);
              setEditItem(null);
            }}
          >
            İptal
          </StandardButton>
        </div>
      </form>
    );
  };

  // Düzenli Gider Formu
  const RegularExpenseForm = ({ category, categoryLabel, onClose }) => {
    const [formData, setFormData] = useState({
      amount: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const expenseData = {
        category,
        categoryLabel,
        amount: parseFloat(formData.amount) || 0,
        description: '' // Açıklama alanını boş bırak
      };
      
      addRegularExpense(expenseData);
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="number"
          placeholder="Tutar (₺)"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          className={`w-full p-2 border rounded text-sm transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-600 border-gray-500 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        />
        <div className="flex gap-2">
          <StandardButton 
            type="submit" 
            variant="success"
            size="sm"
            className="flex-1"
          >
            Kaydet
          </StandardButton>
          <StandardButton
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={onClose}
          >
            İptal
          </StandardButton>
        </div>
      </form>
    );
  };

  // Abonelik Formu
  const SubscriptionForm = ({ category, categoryLabel, subcategory, subcategoryLabel, onClose }) => {
    const [formData, setFormData] = useState({
      amount: '',
      selectedItem: subcategory || '',
      customItem: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const subscriptionData = {
        category,
        categoryLabel,
        subcategory: formData.selectedItem || formData.customItem,
        subcategoryLabel: formData.selectedItem ? subcategoryLabel : formData.customItem,
        amount: parseFloat(formData.amount) || 0,
        description: formData.selectedItem || formData.customItem
      };
      
      addSubscription(subscriptionData);
      onClose();
    };

    // Kategori alt seçenekleri
    const subcategoryOptions = {
      'tasarim': [
        'Adobe Creative Cloud',
        'Figma',
        'Canva Pro',
        'Cinema 4D',
        'Autodesk (3ds Max, Maya)'
      ],
      'yazilim': [
        'GitHub Copilot',
        'Visual Studio',
        'JetBrains',
        'Google Workspace'
      ],
      'pazarlama': [
        'Semrush',
        'Ahrefs',
        'HubSpot',
        'Mailchimp',
        'Buffer / Hootsuite'
      ],
      'eglence-icerik': [
        'Spotify',
        'Apple Music',
        'YouTube',
        'Netflix',
        'Disney+',
        'Amazon Prime',
        'HBO Max',
        'BluTV',
        'Exxen',
        'Gain',
        'MUBI'
      ],
      'yapay-zeka': [
        'ChatGPT',
        'MidJourney',
        'Stable Diffusion',
        'Runway Gen-2',
        'Jasper AI',
        'Copy.ai',
        'Perplexity Pro',
        'Descript'
      ]
    };

    const currentOptions = subcategoryOptions[category] || [];

    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Ürün/Hizmet Seçimi */}
        <div className="space-y-2">
          <label className={`block text-xs font-medium transition-colors duration-200 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Ürün/Hizmet
          </label>
          <select
            value={formData.selectedItem}
            onChange={(e) => setFormData({...formData, selectedItem: e.target.value, customItem: ''})}
            className={`w-full p-2 border rounded text-sm transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-600 border-gray-500 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">-- Seçin veya özel girin --</option>
            {currentOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          
          {/* Özel Giriş */}
          {!formData.selectedItem && (
            <input
              type="text"
              placeholder="Özel ürün/hizmet adı girin..."
              value={formData.customItem}
              onChange={(e) => setFormData({...formData, customItem: e.target.value})}
              className={`w-full p-2 border rounded text-sm transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-600 border-gray-500 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required={!formData.selectedItem}
            />
          )}
        </div>

        {/* Tutar */}
        <input
          type="number"
          placeholder="Aylık Tutar (₺)"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          className={`w-full p-2 border rounded text-sm transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-600 border-gray-500 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        />
        
        <div className="flex gap-2">
          <StandardButton 
            type="submit" 
            variant="success"
            size="sm"
            className="flex-1"
          >
            Kaydet
          </StandardButton>
          <StandardButton
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={onClose}
          >
            İptal
          </StandardButton>
        </div>
      </form>
    );
  };

  // Profil formu
  const ProfileForm = () => {
    const [newProfileName, setNewProfileName] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (newProfileName.trim()) {
        addProfile(newProfileName.trim());
        setNewProfileName('');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Yeni Profil Ekle</h3>
        <input
          type="text"
          placeholder="Profil Adı"
          value={newProfileName}
          onChange={(e) => setNewProfileName(e.target.value)}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        />
        <div className="flex gap-4">
          <StandardButton type="submit" variant="primary">
            Profil Ekle
          </StandardButton>
          <StandardButton
            variant="secondary"
            onClick={() => setShowProfileForm(false)}
          >
            İptal
          </StandardButton>
        </div>
      </form>
    );
  };

  // Standart buton bileşeni - tutarlı boyutlar için
  const StandardButton = ({ 
    type = "button", 
    onClick, 
    className = "", 
    variant = "primary", 
    children, 
    disabled = false,
    size = "md"
  }) => {
    const baseClasses = "font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap overflow-hidden text-ellipsis";
    
    const sizeClasses = {
      sm: "px-3 py-2 text-sm min-h-[36px]",
      md: "px-4 py-2.5 text-sm min-h-[40px]",
      lg: "px-6 py-3 text-base min-h-[44px]"
    };
    
    const variantClasses = {
      primary: darkMode 
        ? "bg-blue-700 hover:bg-blue-600 text-white focus:ring-blue-500" 
        : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
      secondary: darkMode
        ? "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500"
        : "bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500",
      success: darkMode
        ? "bg-green-700 hover:bg-green-600 text-white focus:ring-green-500"
        : "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
      danger: darkMode
        ? "bg-red-700 hover:bg-red-600 text-white focus:ring-red-500"
        : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
    };
    
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        title={typeof children === 'string' ? children : ''}
      >
        <span className="block truncate">{children}</span>
      </button>
    );
  };

  // Tarih seçici bileşeni - bugün butonuyla
  const DateInput = ({ value, onChange, className = "", required = false, label = "" }) => {
    const setToday = () => {
      const today = new Date().toISOString().split('T')[0];
      onChange({ target: { value: today } });
    };

    return (
      <div className="relative">
        {label && (
          <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {label}
          </label>
        )}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={value}
            onChange={onChange}
            className={`flex-1 p-3 border border-gray-300 rounded-md transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } ${className}`}
            required={required}
          />
          <button
            type="button"
            onClick={setToday}
            className={`px-3 py-3 rounded-md transition-colors duration-200 ${
              darkMode 
                ? 'bg-blue-700 hover:bg-blue-600 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            title="Bugüne git"
          >
            📅
          </button>
        </div>
      </div>
    );
  };

  // Basit SVG pasta grafiği bileşeni
  const PieChart = ({ data, title, size = 200, colorType = 'default' }) => {
    // Eğer hiç veri yoksa boş pasta göster
    if (!data || data.length === 0) {
      return (
        <div className="text-center p-4">
          <h4 className="font-semibold mb-2">{title}</h4>
          <div className="flex items-center justify-center" style={{ height: size }}>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full border-8 border-gray-200 mb-4"></div>
              <p className="text-gray-500">Henüz veri yok</p>
            </div>
          </div>
        </div>
      );
    }
    
    // Eğer tüm değerler 0 ise boş pasta göster
    if (data.every(d => d.value === 0)) {
      return (
        <div className="text-center p-4">
          <h4 className="font-semibold mb-2">{title}</h4>
          <div className="flex items-center justify-center" style={{ height: size }}>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full border-8 border-gray-200 mb-4"></div>
              <p className="text-gray-500">Henüz veri yok</p>
            </div>
          </div>
        </div>
      );
    }

    // Sadece 0 olmayan değerleri filtrele
    const validData = data.filter(d => d.value > 0);

    const total = validData.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    const radius = size / 2 - 10;
    const centerX = size / 2;
    const centerY = size / 2;

    // Veriyi değere göre sırala (büyükten küçüğe) ve ona göre renk ata
    const sortedData = [...validData].sort((a, b) => b.value - a.value);
    
    const colorPalettes = {
      income: ['#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16', '#3b82f6'], // Gelir: En büyük dilim yeşil
      expense: ['#ef4444', '#8b5cf6', '#f59e0b', '#06b6d4', '#f97316', '#84cc16', '#3b82f6'], // Gider: En büyük dilim kırmızı
      tax: ['#f97316', '#8b5cf6', '#f59e0b', '#06b6d4', '#10b981', '#84cc16', '#3b82f6'], // Vergi: En büyük dilim turuncu
      default: ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16']
    };

    const basePalette = colorPalettes[colorType] || colorPalettes.default;
    
    // Her veri öğesi için rengi belirle (sıralı dataya göre)
    const colors = validData.map(item => {
      const sortedIndex = sortedData.findIndex(sortedItem => sortedItem.label === item.label);
      return basePalette[sortedIndex % basePalette.length];
    });

    // Tek değer için tam daire çiz
    if (validData.length === 1) {
      const singleItem = validData[0];
      const mainColor = basePalette[0]; // Ana renk
      
      return (
        <div className="text-center">
          <h4 className="font-semibold mb-2">{title}</h4>
          <svg width={size} height={size} className="mx-auto">
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill={mainColor}
              stroke="white"
              strokeWidth="2"
            />
          </svg>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: mainColor }}
                ></div>
                <span>{singleItem.label}</span>
              </div>
              <span>100% (₺{singleItem.value.toLocaleString('tr-TR')})</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center">
        <h4 className="font-semibold mb-2">{title}</h4>
        <svg width={size} height={size} className="mx-auto">
          {validData.map((item, index) => {
            
            const percentage = (item.value / total) * 100;
            const angle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
            const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            currentAngle = endAngle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index]}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        <div className="mt-2 space-y-1 text-sm">
          {validData.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: colors[index] }}
                  ></div>
                  <span>{item.label}</span>
                </div>
                <span>{percentage}% (₺{item.value.toLocaleString('tr-TR')})</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Dashboard Bileşeni
  const Dashboard = () => {
    // Gelir dağılımı için veri hazırlama
    const incomeChartData = dashboardSummary.filteredIncomes.reduce((acc, income) => {
      const brand = income.brand || 'Belirsiz Marka';
      const existing = acc.find(item => item.label === brand);
      if (existing) {
        existing.value += income.amount;
      } else {
        acc.push({ label: brand, value: income.amount });
      }
      return acc;
    }, []);

    // Gider dağılımı için veri hazırlama (Normal giderler + Düzenli giderler + Abonelikler)
    const expenseChartData = [...dashboardSummary.filteredExpenses, ...dashboardSummary.filteredRegularExpenses, ...dashboardSummary.filteredSubscriptions].reduce((acc, expense) => {
      const categories = {
        'ofis-giderleri': 'Ofis Giderleri',
        'donanim': 'Donanım',
        'pazarlama': 'Pazarlama',
        'ulasim': 'Ulaşım',
        'egitim': 'Eğitim',
        'proje-bazli': 'Proje Bazlı Harcamalar',
        'yemek': 'Yemek',
        'internet': 'İnternet',
        'telefon': 'Telefon',
        'muhasebe': 'Muhasebe',
        'kira': 'Kira',
        'elektrik': 'Elektrik',
        'su': 'Su',
        'dogalgaz': 'Doğalgaz',
        'aidat': 'Aidat',
        'tasarim': 'Tasarım',
        'yazilim': 'Yazılım',
        'pazarlama-abonelik': 'Pazarlama',
        'eglence': 'Eğlence & İçerik',
        'yapay-zeka': 'Yapay Zeka',
        'diger': 'Diğer'
      };
      
      const category = categories[expense.category] || expense.category;
      const existing = acc.find(item => item.label === category);
      if (existing) {
        existing.value += expense.amount;
      } else {
        acc.push({ label: category, value: expense.amount });
      }
      return acc;
    }, []);

    // Vergi dağılımı için veri hazırlama
    const taxChartData = dashboardSummary.filteredTaxPayments.reduce((acc, payment) => {
      const type = payment.type || 'Belirsiz';
      const existing = acc.find(item => item.label === type);
      if (existing) {
        existing.value += payment.amount;
      } else {
        acc.push({ label: type, value: payment.amount });
      }
      return acc;
    }, []);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className={`text-2xl font-bold transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Finansal Özet</h2>
          
          {/* Dönem Filtresi - Sağda */}
          <PeriodFilter 
            filter={dashboardFilter} 
            setFilter={setDashboardFilter} 
            label="Dönem" 
          />
        </div>
        
        {/* Ana kartlar - Yeni Düzen: Gelir / Gider / Vergi / Net Kar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`p-6 rounded-lg border transition-colors duration-200 ${
            darkMode 
              ? 'bg-green-900/20 border-green-700' 
              : 'bg-green-50 border-green-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-2 transition-colors duration-200 ${
              darkMode ? 'text-green-300' : 'text-green-800'
            }`}>Gelir</h3>
            <p className={`text-3xl font-bold transition-colors duration-200 ${
              darkMode ? 'text-green-200' : 'text-green-900'
            }`}>₺{dashboardSummary.totalIncome.toLocaleString('tr-TR')}</p>
          </div>
          <div className={`p-6 rounded-lg border transition-colors duration-200 ${
            darkMode 
              ? 'bg-red-900/20 border-red-700' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-2 transition-colors duration-200 ${
              darkMode ? 'text-red-300' : 'text-red-800'
            }`}>Gider</h3>
            <p className={`text-3xl font-bold transition-colors duration-200 ${
              darkMode ? 'text-red-200' : 'text-red-900'
            }`}>₺{dashboardSummary.totalExpenses.toLocaleString('tr-TR')}</p>
          </div>
          <div className={`p-6 rounded-lg border transition-colors duration-200 ${
            darkMode 
              ? 'bg-purple-900/20 border-purple-700' 
              : 'bg-purple-50 border-purple-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-2 transition-colors duration-200 ${
              darkMode ? 'text-purple-300' : 'text-purple-800'
            }`}>Vergi</h3>
            <p className={`text-3xl font-bold transition-colors duration-200 ${
              darkMode ? 'text-purple-200' : 'text-purple-900'
            }`}>₺{dashboardSummary.totalTaxPaid.toLocaleString('tr-TR')}</p>
            {dashboardSummary.totalVATFromIncomes > 0 && (
              <p className={`text-sm mt-1 transition-colors duration-200 ${
                darkMode ? 'text-purple-300' : 'text-purple-600'
              }`}>
                KDV: ₺{dashboardSummary.totalVATFromIncomes.toLocaleString('tr-TR')}
              </p>
            )}
          </div>
          <div className={`p-6 rounded-lg border transition-colors duration-200 ${
            darkMode 
              ? 'bg-blue-900/20 border-blue-700' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-2 transition-colors duration-200 ${
              darkMode ? 'text-blue-300' : 'text-blue-800'
            }`}>Net Kar</h3>
            <p className={`text-3xl font-bold transition-colors duration-200 ${
              darkMode ? 'text-blue-200' : 'text-blue-900'
            }`}>₺{dashboardSummary.netProfit.toLocaleString('tr-TR')}</p>
          </div>
        </div>

        {/* Projeler Özet - Tüm Durumları Göster */}
        {(() => {
          const totalProjectCount = dashboardSummary.filteredProjects.length;
          // İptal edilen projeleri toplam değerden hariç tut
          const activeProjectsForValue = dashboardSummary.filteredProjects.filter(p => p.status !== 'iptal-edildi');
          const totalProjectValue = activeProjectsForValue.reduce((sum, p) => sum + (p.price || 0), 0);
          const completedProjects = dashboardSummary.filteredProjects.filter(p => p.status === 'tamamlandi').length;
          const activeProjects = dashboardSummary.filteredProjects.filter(p => p.status === 'devam-ediyor').length;
          const proposalSent = dashboardSummary.filteredProjects.filter(p => p.status === 'teklif-iletildi').length;
          const onHold = dashboardSummary.filteredProjects.filter(p => p.status === 'beklemede').length;
          const cancelled = dashboardSummary.filteredProjects.filter(p => p.status === 'iptal-edildi').length;
          
          if (totalProjectCount === 0) return null;
          
          return (
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Proje Özeti</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {/* Teklif İletildi - İlk sırada */}
                <div className={`p-3 rounded-lg border text-center transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-yellow-900/20 border-yellow-700' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <h4 className={`text-xs font-medium mb-1 transition-colors duration-200 ${
                    darkMode ? 'text-yellow-300' : 'text-yellow-800'
                  }`}>Teklif İletildi</h4>
                  <p className={`text-xl font-bold transition-colors duration-200 ${
                    darkMode ? 'text-yellow-200' : 'text-yellow-900'
                  }`}>{proposalSent}</p>
                </div>
                
                {/* Devam Ediyor - İkinci sırada */}
                <div className={`p-3 rounded-lg border text-center transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-green-900/20 border-green-700' 
                    : 'bg-green-50 border-green-200'
                }`}>
                  <h4 className={`text-xs font-medium mb-1 transition-colors duration-200 ${
                    darkMode ? 'text-green-300' : 'text-green-800'
                  }`}>Devam Ediyor</h4>
                  <p className={`text-xl font-bold transition-colors duration-200 ${
                    darkMode ? 'text-green-200' : 'text-green-900'
                  }`}>{activeProjects}</p>
                </div>
                
                {/* Revizyonda - Üçüncü sırada */}
                <div className={`p-3 rounded-lg border text-center transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-orange-900/20 border-orange-700' 
                    : 'bg-orange-50 border-orange-200'
                }`}>
                  <h4 className={`text-xs font-medium mb-1 transition-colors duration-200 ${
                    darkMode ? 'text-orange-300' : 'text-orange-800'
                  }`}>Revizyonda</h4>
                  <p className={`text-xl font-bold transition-colors duration-200 ${
                    darkMode ? 'text-orange-200' : 'text-orange-900'
                  }`}>{dashboardSummary.filteredProjects.filter(p => p.status === 'revizyonda').length}</p>
                </div>
                
                {/* Tamamlandı - Dördüncü sırada */}
                <div className={`p-3 rounded-lg border text-center transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-blue-900/20 border-blue-700' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <h4 className={`text-xs font-medium mb-1 transition-colors duration-200 ${
                    darkMode ? 'text-blue-300' : 'text-blue-800'
                  }`}>Tamamlandı</h4>
                  <p className={`text-xl font-bold transition-colors duration-200 ${
                    darkMode ? 'text-blue-200' : 'text-blue-900'
                  }`}>{completedProjects}</p>
                </div>
                
                {/* İptal Edildi - Beşinci sırada */}
                <div className={`p-3 rounded-lg border text-center transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-red-900/20 border-red-700' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <h4 className={`text-xs font-medium mb-1 transition-colors duration-200 ${
                    darkMode ? 'text-red-300' : 'text-red-800'
                  }`}>İptal Edildi</h4>
                  <p className={`text-xl font-bold transition-colors duration-200 ${
                    darkMode ? 'text-red-200' : 'text-red-900'
                  }`}>{cancelled}</p>
                </div>
                
                {/* Toplam - Altıncı sırada */}
                <div className={`p-3 rounded-lg border text-center transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-indigo-900/20 border-indigo-700' 
                    : 'bg-indigo-50 border-indigo-200'
                }`}>
                  <h4 className={`text-xs font-medium mb-1 transition-colors duration-200 ${
                    darkMode ? 'text-indigo-300' : 'text-indigo-800'
                  }`}>Toplam</h4>
                  <p className={`text-xl font-bold transition-colors duration-200 ${
                    darkMode ? 'text-indigo-200' : 'text-indigo-900'
                  }`}>{totalProjectCount}</p>
                </div>
                
                {/* Toplam Değer - Son sırada */}
                <div className={`p-3 rounded-lg border text-center transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-purple-900/20 border-purple-700' 
                    : 'bg-purple-50 border-purple-200'
                }`}>
                  <h4 className={`text-xs font-medium mb-1 transition-colors duration-200 ${
                    darkMode ? 'text-purple-300' : 'text-purple-800'
                  }`}>Toplam Değer</h4>
                  <p className={`text-lg font-bold transition-colors duration-200 ${
                    darkMode ? 'text-purple-200' : 'text-purple-900'
                  }`}>₺{totalProjectValue.toLocaleString('tr-TR')}</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Ajanda Özeti - Basit Bildirimler */}
        {(() => {
          const recentItems = agenda
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3); // En son 3 öğe
          
          if (recentItems.length === 0) return null;
          
          return (
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Ajanda Özeti</h3>
              
              <div className="space-y-2">
                {recentItems.map(item => (
                  <div key={item.id} className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-slate-800 border-slate-700' 
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                        darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                      }`}>
                        📅 {new Date(item.date).toLocaleDateString('tr-TR')}
                      </div>
                      <span className="text-xs">•</span>
                      <span className={`text-sm font-medium transition-colors duration-200 ${
                        darkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {item.title}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('agenda');
                        // Ajanda sekmesine gidince o notu vurgula
                        setTimeout(() => {
                          const element = document.getElementById(`agenda-item-${item.id}`);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            element.style.background = darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.1)';
                            setTimeout(() => {
                              element.style.background = '';
                            }, 3000);
                          }
                        }, 100);
                      }}
                      className={`px-2 py-1 text-xs rounded transition-colors duration-200 ${
                        darkMode 
                          ? 'bg-blue-700 text-blue-200 hover:bg-blue-600' 
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                      title="Ajandaya git ve detayı gör"
                    >
                      👁️ Görüntüle
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Pasta grafikleri */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`p-6 rounded-lg border transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <PieChart 
              data={incomeChartData} 
              title="Gelir"
              size={250}
              colorType="income"
            />
          </div>
          <div className={`p-6 rounded-lg border transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <PieChart 
              data={expenseChartData} 
              title="Gider"
              size={250}
              colorType="expense"
            />
          </div>
          <div className={`p-6 rounded-lg border transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <PieChart 
              data={taxChartData} 
              title="Vergi"
              size={250}
              colorType="tax"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`shadow-sm border-b transition-colors duration-200 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Düzenlenebilir Başlık */}
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={appTitle}
                    onChange={(e) => setAppTitle(e.target.value)}
                    className={`text-2xl font-bold border-b-2 border-blue-500 bg-transparent focus:outline-none transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        updateTitle(appTitle);
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => updateTitle(appTitle)}
                    className="text-green-600 hover:text-green-700 text-xl"
                    title="Kaydet"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => {
                      setAppTitle(localStorage.getItem('appTitle') || 'Freelancer Finans Takip');
                      setIsEditingTitle(false);
                    }}
                    className="text-red-600 hover:text-red-700 text-xl"
                    title="İptal"
                  >
                    ✗
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className={`text-2xl font-bold transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {appTitle}
                  </h1>
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ${
                      darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Başlığı düzenle"
                  >
                    ✏️
                  </button>
                </div>
              )}
            </div>
            
            {/* Right side controls */}
            <div className="flex items-center gap-4">
              {/* Test butonu kaldırıldı - varsayılan veriler kullanılıyor */}
              
              {/* Online/Offline Status - Profil yerine taşındı */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                isOnline 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                {isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
              </div>
              
              {/* Profil Seçimi ve Yönetimi - En sağa taşındı */}
              <div className="flex items-center gap-2">
                <label className={`text-sm font-medium transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Profil:</label>
                <select
                  value={currentProfile}
                  onChange={(e) => {
                    setCurrentProfile(e.target.value);
                    localStorage.setItem('currentProfile', e.target.value);
                  }}
                  className={`px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {profiles.map(profile => (
                    <option key={profile} value={profile}>{profile}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowProfileForm(true)}
                  className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                  title="Yeni profil ekle"
                >
                  ➕
                </button>
                <button
                  onClick={() => {
                    const newName = prompt(`"${currentProfile}" profil adını değiştir:`, currentProfile);
                    if (newName && newName !== currentProfile) {
                      if (renameProfile(currentProfile, newName)) {
                        alert('Profil adı başarıyla değiştirildi!');
                      }
                    }
                  }}
                  className="px-3 py-2 bg-amber-600 text-white text-sm rounded-md hover:bg-amber-700"
                  title="Profil adını değiştir"
                >
                  ✏️
                </button>
                
                {/* Profil İçe/Dışa Aktarma - Daha belirgin */}
                <div className="flex items-center gap-1 ml-2 pl-2 border-l border-gray-300 dark:border-gray-600">
                  <button
                    onClick={exportProfileToJSON}
                    className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 font-medium flex items-center gap-1"
                    title="Tüm profilleri dışa aktar"
                  >
                    📤 Dışa Aktar
                  </button>
                  <label className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 cursor-pointer font-medium flex items-center gap-1">
                    📥 İçe Aktar
                    <input
                      type="file"
                      accept=".json"
                      onChange={importProfileFromJSON}
                      className="hidden"
                      title="Profilleri içe aktar"
                    />
                  </label>
                </div>
                {currentProfile !== 'default' && (
                  <button
                    onClick={() => deleteProfile(currentProfile)}
                    className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                    title="Profili sil"
                  >
                    🗑️
                  </button>
                )}
                <button
                  onClick={clearCurrentProfile}
                  className="px-3 py-2 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700"
                  title="Profili sıfırla"
                >
                  🔄
                </button>
              </div>
              
              {/* Dark Mode Toggle - En sağda */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title={darkMode ? 'Açık tema' : 'Koyu tema'}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Offline Warning */}
      {!isOnline && (
        <div className="bg-yellow-50 border border-yellow-200 px-4 py-3">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-yellow-800">
              <span className="text-lg">⚠️</span>
              <p className="text-sm">
                <strong>Çevrimdışı Modda:</strong> Verileriniz güvenli bir şekilde yerel olarak saklanıyor. 
                İnternet bağlantınız geldiğinde otomatik olarak senkronize edilecek.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`border-b transition-colors duration-200 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'projects', label: 'Projeler', icon: '📁' },
              { id: 'income', label: 'Gelirler', icon: '💰' },
              { id: 'expenses', label: 'Giderler', icon: '💸' },
              { id: 'taxes', label: 'Vergiler', icon: '📋' },
              { id: 'agenda', label: 'Ajanda', icon: '📅' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : darkMode 
                      ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Profil Formu */}
        {showProfileForm && (
          <div className={`mb-6 p-6 rounded-lg border transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <ProfileForm />
          </div>
        )}

        {activeTab === 'dashboard' && <Dashboard />}
        
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold">Projeler</h2>
              <div className="flex flex-wrap items-center gap-3">
                {/* Dönem Filtresi */}
                <PeriodFilter 
                  filter={projectsFilter} 
                  setFilter={setProjectsFilter} 
                  label="Dönem" 
                />
                <StandardButton
                  onClick={() => setShowForm('project')}
                  variant="primary"
                  className="h-10"
                >
                  Yeni Proje
                </StandardButton>
              </div>
            </div>
            
            {(showForm === 'project' || (editItem && editItem.type === 'project')) && (
              <div className={`p-6 rounded-lg border transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <ProjectForm project={editItem?.data} />
              </div>
            )}
            
            {/* Projeler Gruplandırılmış Gösterim */}
            {(() => {
              const filteredProjects = filterDataByPeriod(projects, 'start_date', projectsFilter);
              const groupedProjects = filteredProjects.reduce((acc, project) => {
                if (!acc[project.status]) {
                  acc[project.status] = [];
                }
                acc[project.status].push(project);
                return acc;
              }, {});

              const statusLabels = {
                'teklif-iletildi': 'Teklif İletildi',
                'devam-ediyor': 'Devam Ediyor',
                'revizyonda': 'Revizyonda',
                'tamamlandi': 'Tamamlandı',
                'iptal-edildi': 'İptal Edildi'
              };

              const statusColors = {
                'teklif-iletildi': darkMode 
                  ? 'bg-yellow-900/20 border-yellow-700' 
                  : 'bg-yellow-50 border-yellow-200',
                'devam-ediyor': darkMode 
                  ? 'bg-green-900/20 border-green-700' 
                  : 'bg-green-50 border-green-200',
                'revizyonda': darkMode 
                  ? 'bg-orange-900/20 border-orange-700' 
                  : 'bg-orange-50 border-orange-200',
                'tamamlandi': darkMode 
                  ? 'bg-blue-900/20 border-blue-700' 
                  : 'bg-blue-50 border-blue-200',
                'iptal-edildi': darkMode 
                  ? 'bg-red-900/20 border-red-700' 
                  : 'bg-red-50 border-red-200'
              };

              return Object.entries(groupedProjects).map(([status, statusProjects]) => (
                <div key={status} className={`p-4 rounded-lg border transition-colors duration-200 ${statusColors[status] || (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200')}`}>
                  <h3 className="text-lg font-semibold mb-4">
                    {statusLabels[status] || status} ({statusProjects.length})
                  </h3>
                  <div className="grid gap-4">
                    {statusProjects
                      .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
                      .map(project => (
                      <div key={project.id} className={`p-6 rounded-lg border transition-colors duration-200 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <span className={`text-sm font-medium px-3 py-1 rounded-full transition-colors duration-200 ${
                                darkMode 
                                  ? 'bg-blue-800 text-blue-200' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                📅 {project.start_date}
                              </span>
                            </div>
                            <h4 className="text-lg font-semibold">{project.name}</h4>
                            <p className="text-gray-600">{project.description}</p>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <div>
                              <p className="text-xl font-bold text-blue-600">₺{project.price?.toLocaleString('tr-TR') || '0'}</p>
                            </div>
                            <StandardButton
                              onClick={() => setEditItem({ type: 'project', data: project })}
                              variant="secondary"
                              size="sm"
                              className="px-3 py-1"
                            >
                              ✏️
                            </StandardButton>
                            <StandardButton
                              onClick={() => deleteProject(project.id)}
                              variant="danger"
                              size="sm"
                              className="px-3 py-1"
                            >
                              🗑️
                            </StandardButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}
        
        {activeTab === 'income' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold">Gelirler</h2>
              <div className="flex flex-wrap items-center gap-3">
                {/* Dönem Filtresi */}
                <PeriodFilter 
                  filter={incomesFilter} 
                  setFilter={setIncomesFilter} 
                  label="Dönem" 
                />
                <StandardButton
                  onClick={() => setShowForm('income')}
                  variant="success"
                  className="h-10"
                >
                  Yeni Gelir
                </StandardButton>
              </div>
            </div>
            
            {(showForm === 'income' || (editItem && editItem.type === 'income')) && (
              <div className={`p-6 rounded-lg border transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <IncomeForm income={editItem?.data} />
              </div>
            )}
            
            <div className="grid gap-4">
              {filterDataByPeriod(incomes, 'income_date', incomesFilter)
                .sort((a, b) => new Date(b.income_date) - new Date(a.income_date))
                .map(income => {
                const relatedProject = projects.find(p => p.id === income.project_id);
                return (
                  <div key={income.id} className={`p-6 rounded-lg border transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-emerald-900/20 border-emerald-700' 
                      : 'bg-emerald-50 border-emerald-200'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`text-sm font-medium px-3 py-1 rounded-full transition-colors duration-200 ${
                            darkMode 
                              ? 'bg-emerald-800 text-emerald-200' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            📅 {income.income_date}
                          </span>
                        </div>
                        <h3 className={`text-lg font-semibold transition-colors duration-200 ${
                          darkMode ? 'text-emerald-200' : 'text-emerald-900'
                        }`}>
                          {income.brand || 'Belirsiz Marka'}
                        </h3>
                        {relatedProject && (
                          <p className={`font-medium transition-colors duration-200 ${
                            darkMode ? 'text-emerald-300' : 'text-emerald-700'
                          }`}>
                            Proje: {relatedProject.name}
                          </p>
                        )}
                        <p className={`transition-colors duration-200 ${
                          darkMode ? 'text-emerald-300' : 'text-emerald-700'
                        }`}>
                          {income.description}
                        </p>
                        <div className={`text-sm mt-1 transition-colors duration-200 ${
                          darkMode ? 'text-emerald-400' : 'text-emerald-600'
                        }`}>
                          <p>Vergi: ₺{income.tax_amount?.toLocaleString('tr-TR') || '0'}</p>
                          <p>Net: ₺{income.net_amount?.toLocaleString('tr-TR') || income.amount?.toLocaleString('tr-TR')}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <div>
                          <p className={`text-xl font-bold transition-colors duration-200 ${
                            darkMode ? 'text-emerald-300' : 'text-emerald-700'
                          }`}>
                            ₺{income.amount.toLocaleString('tr-TR')}
                          </p>
                          <p className={`text-xs transition-colors duration-200 ${
                            darkMode ? 'text-emerald-400' : 'text-emerald-500'
                          }`}>Tutar</p>
                        </div>
                        <StandardButton
                          onClick={() => setEditItem({ type: 'income', data: income })}
                          variant="secondary"
                          size="sm"
                          className="px-3 py-1"
                        >
                          ✏️
                        </StandardButton>
                        <StandardButton
                          onClick={() => deleteIncome(income.id)}
                          variant="danger"
                          size="sm"
                          className="px-3 py-1"
                        >
                          🗑️
                        </StandardButton>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            {/* Düzenli Giderler Bölümü - Üst kısım */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Sabit Giderler</h2>
                  <p className={`text-sm mt-1 transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Aylık tekrarlayan giderlerinizi yönetin
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Dönem Filtresi */}
                  <PeriodFilter 
                    filter={expensesFilter} 
                    setFilter={setExpensesFilter} 
                    label="Dönem" 
                  />
                  <StandardButton
                    onClick={() => setShowForm('expense')}
                    variant="danger"
                    className="h-10"
                  >
                    Yeni Gider
                  </StandardButton>
                </div>
              </div>
              
              {/* Sabit Giderler Bölümü */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  🏠 Sabit Giderler
                </h3>
                
                {/* Sabit Gider Kategori Butonları - 4'erli 2 satır - İstenen sıralama */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { key: 'internet', label: 'İnternet', icon: '🌐' },
                    { key: 'telefon', label: 'Telefon', icon: '📱' },
                    { key: 'muhasebe', label: 'Muhasebe', icon: '📊' },
                    { key: 'kira', label: 'Kira', icon: '🏠' },
                    { key: 'elektrik', label: 'Elektrik', icon: '⚡' },
                    { key: 'su', label: 'Su', icon: '💧' },
                    { key: 'dogalgaz', label: 'Doğalgaz', icon: '🔥' },
                    { key: 'aidat', label: 'Aidat', icon: '🏢' }
                  ].map(category => {
                  // Mevcut döneme ait düzenli giderleri filtrele
                  const currentPeriod = `${dashboardFilter.year}-${String(dashboardFilter.month + 1).padStart(2, '0')}`;
                  const categoryExpenses = regularExpenses.filter(expense => 
                    expense.category === category.key && expense.period === currentPeriod
                  );
                  
                  return (
                    <div key={category.key} className={`p-4 rounded-lg border transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                    }`}>
                      <div className="text-center mb-3">
                        <div className="text-2xl mb-1">{category.icon}</div>
                        <h4 className={`text-sm font-medium transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>{category.label}</h4>
                      </div>
                      
                      {/* Mevcut Giderler */}
                      <div className="space-y-2 mb-3">
                        {categoryExpenses.map((expense, index) => (
                          <div key={expense.id} className={`flex items-center justify-between p-2 rounded text-xs transition-colors duration-200 ${
                            darkMode 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-50 text-gray-700'
                          }`}>
                            <div className="flex items-center justify-between w-full">
                              <div className="font-medium">₺{expense.amount.toLocaleString('tr-TR')}</div>
                              <button
                                onClick={() => deleteRegularExpense(expense.id)}
                                className="text-red-500 hover:text-red-700 ml-2"
                                title="Sil"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Yeni Gider Ekleme */}
                      <button
                        onClick={() => setShowForm(`regular-${category.key}`)}
                        className={`w-full py-2 px-3 text-xs rounded border-2 border-dashed transition-colors duration-200 ${
                          darkMode 
                            ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300' 
                            : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
                        }`}
                      >
                        + Ekle
                      </button>
                      
                      {/* Form */}
                      {showForm === `regular-${category.key}` && (
                        <div className="mt-3 pt-3 border-t">
                          <RegularExpenseForm 
                            category={category.key}
                            categoryLabel={category.label}
                            onClose={() => setShowForm(null)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Abonelikler Bölümü */}
            <div className="space-y-4 mt-8 pt-8 border-t border-dashed">
              <h3 className={`text-lg font-semibold transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                📱 Abonelikler
              </h3>
              <p className={`text-sm transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Aylık ödediğiniz abonelikleri kategoriler halinde yönetin
              </p>
              
              {/* Abonelik Kategori Butonları */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'tasarim', label: 'Tasarım', icon: '🎨' },
                  { key: 'yazilim', label: 'Yazılım', icon: '💻' },
                  { key: 'pazarlama', label: 'Pazarlama', icon: '📈' },
                  { key: 'eglence-icerik', label: 'Eğlence & İçerik', icon: '🎬' },
                  { key: 'yapay-zeka', label: 'Yapay Zeka', icon: '🤖' }
                ].map(category => {
                  // Mevcut döneme ait abonelikleri filtrele
                  const currentPeriod = `${dashboardFilter.year}-${String(dashboardFilter.month + 1).padStart(2, '0')}`;
                  const categorySubscriptions = subscriptions.filter(subscription => 
                    subscription.category === category.key && subscription.period === currentPeriod
                  );
                  
                  return (
                    <div key={category.key} className={`p-4 rounded-lg border transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                    }`}>
                      <div className="text-center mb-3">
                        <div className="text-2xl mb-1">{category.icon}</div>
                        <h4 className={`text-sm font-medium transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>{category.label}</h4>
                      </div>
                      
                      {/* Mevcut Abonelikler */}
                      <div className="space-y-2 mb-3">
                        {categorySubscriptions.map((subscription, index) => (
                          <div key={subscription.id} className={`p-2 rounded text-xs transition-colors duration-200 ${
                            darkMode 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-50 text-gray-700'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{subscription.subcategoryLabel || subscription.description}</div>
                                <div className="text-green-600 font-semibold">₺{subscription.amount.toLocaleString('tr-TR')}</div>
                              </div>
                              <button
                                onClick={() => deleteSubscription(subscription.id)}
                                className="text-red-500 hover:text-red-700 ml-2"
                                title="Sil"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Yeni Abonelik Ekleme */}
                      <button
                        onClick={() => setShowForm(`subscription-${category.key}`)}
                        className={`w-full py-2 px-3 text-xs rounded border-2 border-dashed transition-colors duration-200 ${
                          darkMode 
                            ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300' 
                            : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
                        }`}
                      >
                        + Abonelik Ekle
                      </button>
                      
                      {/* Form */}
                      {showForm === `subscription-${category.key}` && (
                        <div className="mt-3 pt-3 border-t">
                          <SubscriptionForm 
                            category={category.key}
                            categoryLabel={category.label}
                            onClose={() => setShowForm(null)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            </div>
            
            {/* Normal Giderler Bölümü - Alt kısım */}
            <div className="space-y-6 mt-8 pt-8 border-t border-dashed">
              <div className="flex justify-between items-center">
                <h3 className={`text-lg font-semibold transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  📝 Normal Giderler
                </h3>
              </div>
              
              {(showForm === 'expense' || (editItem && editItem.type === 'expense')) && (
                <div className={`p-6 rounded-lg border transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <ExpenseForm expense={editItem?.data} />
                </div>
              )}
              
              <div className="grid gap-4">
              {filterDataByPeriod(expenses, 'expense_date', expensesFilter)
                .sort((a, b) => new Date(b.expense_date) - new Date(a.expense_date))
                .map(expense => {
                const categories = {
                  'ofis-giderleri': 'Ofis Giderleri',
                  'donanim': 'Donanım',
                  'pazarlama': 'Pazarlama',
                  'ulasim': 'Ulaşım',
                  'egitim': 'Eğitim',
                  'proje-bazli': 'Proje Bazlı Harcamalar',
                  'yemek': 'Yemek',
                  'diger': 'Diğer'
                };
                
                return (
                  <div key={expense.id} className={`p-6 rounded-lg border transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-red-900/20 border-red-700' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`text-sm font-medium px-3 py-1 rounded-full transition-colors duration-200 ${
                            darkMode 
                              ? 'bg-red-800 text-red-200' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            📅 {expense.expense_date}
                          </span>
                        </div>
                        <h3 className={`text-lg font-semibold transition-colors duration-200 ${
                          darkMode ? 'text-red-200' : 'text-red-900'
                        }`}>
                          {categories[expense.category] || expense.category}
                        </h3>
                        <p className={`transition-colors duration-200 ${
                          darkMode ? 'text-red-300' : 'text-red-700'
                        }`}>
                          {expense.description || 'Açıklama yok'}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <div>
                          <p className={`text-xl font-bold transition-colors duration-200 ${
                            darkMode ? 'text-red-300' : 'text-red-700'
                          }`}>
                            ₺{expense.amount.toLocaleString('tr-TR')}
                          </p>
                        </div>
                        <StandardButton
                          onClick={() => setEditItem({ type: 'expense', data: expense })}
                          variant="secondary"
                          size="sm"
                          className="px-3 py-1"
                        >
                          ✏️
                        </StandardButton>
                        <StandardButton
                          onClick={() => deleteExpense(expense.id)}
                          variant="danger"
                          size="sm"
                          className="px-3 py-1"
                        >
                          🗑️
                        </StandardButton>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'taxes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold">Vergi Yönetimi</h2>
              <div className="flex flex-wrap items-center gap-3">
                {/* Dönem Filtresi */}
                <PeriodFilter 
                  filter={taxesFilter} 
                  setFilter={setTaxesFilter} 
                  label="Dönem" 
                />
                <StandardButton
                  onClick={() => setShowForm('tax')}
                  variant="primary"
                  className="h-10"
                >
                  Yeni Ödeme
                </StandardButton>
              </div>
            </div>
            
            {(showForm === 'tax' || (editItem && editItem.type === 'tax')) && (
              <div className={`p-6 rounded-lg border transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <TaxPaymentForm taxPayment={editItem?.data} />
              </div>
            )}
            
            {/* Vergi Ödemeleri - Üstte */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Vergi Ödemeleri</h3>
              <div className="grid gap-4">
                {filterDataByPeriod(taxPayments, 'payment_date', taxesFilter)
                  .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))
                  .map(payment => (
                  <div key={payment.id} className={`p-6 rounded-lg border transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-violet-900/20 border-violet-700' 
                      : 'bg-violet-50 border-violet-200'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`text-sm font-medium px-3 py-1 rounded-full transition-colors duration-200 ${
                            darkMode 
                              ? 'bg-violet-800 text-violet-200' 
                              : 'bg-violet-100 text-violet-800'
                          }`}>
                            📅 {payment.payment_date}
                          </span>
                        </div>
                        <h3 className={`text-lg font-semibold transition-colors duration-200 ${
                          darkMode ? 'text-violet-200' : 'text-violet-900'
                        }`}>
                          {payment.type || 'Vergi Ödemesi'}
                        </h3>
                        {payment.description && (
                          <p className={`mb-3 transition-colors duration-200 ${
                            darkMode ? 'text-violet-300' : 'text-violet-700'
                          }`}>
                            {payment.description}
                          </p>
                        )}
                        <p className={`text-xl font-bold transition-colors duration-200 ${
                          darkMode ? 'text-violet-300' : 'text-violet-700'
                        }`}>
                          ₺{payment.amount.toLocaleString('tr-TR')}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <StandardButton
                          onClick={() => setEditItem({ type: 'tax', data: payment })}
                          variant="secondary"
                          size="sm"
                          className="px-3 py-1"
                        >
                          ✏️
                        </StandardButton>
                        <StandardButton
                          onClick={() => deleteTaxPayment(payment.id)}
                          variant="danger"
                          size="sm"
                          className="px-3 py-1"
                        >
                          🗑️
                        </StandardButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* KDV Bilgileri - Gelirlerden - Altta */}
            {(() => {
              const filteredIncomes = filterDataByPeriod(incomes, 'income_date', taxesFilter);
              const vatIncomes = filteredIncomes.filter(income => income.tax_amount && income.tax_amount > 0);
              
              if (vatIncomes.length > 0) {
                return (
                  <div className={`p-6 rounded-lg border transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-blue-900/20 border-blue-700' 
                      : 'bg-blue-50 border-blue-200'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${
                      darkMode ? 'text-blue-300' : 'text-blue-800'
                    }`}>KDV (Gelir)</h3>
                    <div className="space-y-3">
                      {vatIncomes.map(income => (
                        <div key={income.id} className={`p-4 rounded border transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-violet-800/20 border-violet-600' 
                            : 'bg-white border-violet-200'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
                                  darkMode 
                                    ? 'bg-violet-700 text-violet-200' 
                                    : 'bg-violet-100 text-violet-700'
                                }`}>
                                  📅 {income.income_date}
                                </span>
                              </div>
                              <p className={`font-semibold transition-colors duration-200 ${
                                darkMode ? 'text-violet-200' : 'text-violet-800'
                              }`}>
                                {income.brand || 'Belirsiz Marka'}
                              </p>
                              <p className={`text-sm transition-colors duration-200 ${
                                darkMode ? 'text-violet-300' : 'text-violet-600'
                              }`}>
                                {income.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`text-lg font-bold transition-colors duration-200 ${
                                darkMode ? 'text-violet-300' : 'text-violet-700'
                              }`}>
                                ₺{income.tax_amount.toLocaleString('tr-TR')} KDV
                              </p>
                              <p className={`text-sm transition-colors duration-200 ${
                                darkMode ? 'text-violet-400' : 'text-violet-600'
                              }`}>
                                %{((income.vat_rate || 0.18) * 100).toFixed(0)} oran
                              </p>
                              <p className={`text-xs transition-colors duration-200 ${
                                darkMode ? 'text-violet-500' : 'text-violet-500'
                              }`}>
                                Ana Tutar: ₺{income.amount.toLocaleString('tr-TR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-3 mt-3">
                        <div className={`flex justify-between items-center p-3 rounded transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-blue-800/30 text-blue-200' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          <span className="font-semibold">Toplam Oluşan KDV:</span>
                          <span className="text-xl font-bold">
                            ₺{vatIncomes.reduce((sum, income) => sum + (income.tax_amount || 0), 0).toLocaleString('tr-TR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
        
        {activeTab === 'agenda' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className={`text-2xl font-bold transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Ajanda</h2>
              <StandardButton
                onClick={() => setShowForm('agenda')}
                variant="primary"
                className="h-10"
              >
                📅 Yeni Not
              </StandardButton>
            </div>
            
            {/* Ajanda Formu */}
            {(showForm === 'agenda' || (editItem && editItem.type === 'agenda')) && (
              <div className={`p-6 rounded-lg border transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <AgendaForm agendaItem={editItem?.data} />
              </div>
            )}
            
            {/* Ajanda Listesi */}
            <div className="space-y-4">
              {agenda.length === 0 ? (
                <div className={`text-center py-12 rounded-lg border-2 border-dashed transition-colors duration-200 ${
                  darkMode 
                    ? 'border-gray-600 text-gray-400' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-xl font-medium mb-2">Henüz ajanda notu yok</p>
                  <p>İlk ajanda notunuzu eklemek için "Yeni Not" butonuna tıklayın</p>
                </div>
              ) : (
                agenda
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map(item => {
                    const isToday = item.date === new Date().toISOString().split('T')[0];
                    const isPast = new Date(item.date) < new Date().setHours(0,0,0,0);
                    
                    return (
                      <div key={item.id} id={`agenda-item-${item.id}`} className={`p-6 rounded-lg border transition-colors duration-200 ${
                        darkMode 
                          ? 'bg-indigo-900/20 border-indigo-700' 
                          : 'bg-indigo-50 border-indigo-200'
                      } ${isToday ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''} ${
                        isPast ? 'opacity-60' : ''
                      }`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className={`text-sm font-medium px-3 py-1 rounded-full transition-colors duration-200 ${
                                darkMode 
                                  ? 'bg-indigo-800 text-indigo-200' 
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}>
                                📅 {new Date(item.date).toLocaleDateString('tr-TR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  weekday: 'long'
                                })}
                              </span>
                              {isToday && (
                                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                  Bugün
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                item.priority === 'yuksek' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                                item.priority === 'orta' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                                'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                              }`}>
                                {item.priority === 'yuksek' ? '🔴 Yüksek' : 
                                 item.priority === 'orta' ? '🟡 Orta' : '🟢 Düşük'}
                              </span>
                            </div>
                            <h3 className={`text-lg font-semibold mb-2 transition-colors duration-200 ${
                              darkMode ? 'text-indigo-200' : 'text-indigo-900'
                            }`}>
                              {item.title}
                            </h3>
                            <p className={`text-sm mb-3 transition-colors duration-200 ${
                              darkMode ? 'text-indigo-300' : 'text-indigo-700'
                            }`}>
                              {item.note}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <StandardButton
                              onClick={() => setEditItem({ type: 'agenda', data: item })}
                              variant="secondary"
                              size="sm"
                              className="px-3 py-1"
                            >
                              ✏️
                            </StandardButton>
                            <StandardButton
                              onClick={() => deleteAgendaItem(item.id)}
                              variant="danger"
                              size="sm"
                              className="px-3 py-1"
                            >
                              🗑️
                            </StandardButton>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;