# 🚀 PRODUCTION INTEGRATION CHECKLIST

## ✅ ЧТО УЖЕ СДЕЛАНО

1. **API Client (client.ts)**
   - ✅ Fetch-based HTTP client с token management
   - ✅ Auto-logout при 401
   - ✅ Обработка 204 No Content

2. **API Types (types.ts)**
   - ✅ Все DTOs из Swagger определены
   - ✅ Поддержка всех endpoints

3. **Services**
   - ✅ authService (login/logout/token)
   - ✅ companyService (CRUD + followers)
   - ✅ studentService (CRUD + education + experience + follow)
   - ✅ internshipService (CRUD)

4. **Hooks**
   - ✅ useAsyncData - для fetch данных
   - ✅ useAsyncMutation - для POST/PUT/DELETE

5. **Components**
   - ✅ ErrorBoundary - для обработки ошибок
   - ✅ Internships страница - интегрирована с API

6. **Config**
   - ✅ .env.local с VITE_API_URL

---

## 📋 NEXT STEPS (DO THIS NOW)

### A. Обновить оставшиеся Pages (15-20 минут)

**Student Pages:**

1. **Student/Favorites.tsx** → Replace mock companies with:
   ```tsx
   const { data: followedCompanies } = useAsyncData(
     () => studentService.getFollowedCompanies(50, 0),
     []
   );
   ```

2. **Student/Profile.tsx** → Add edit functionality:
   ```tsx
   const { execute: updateProfile } = useAsyncMutation(
     (data) => studentService.updateStudent(userId, data)
   );
   ```

3. **Student/Dashboard.tsx** → Show user info + quick links:
   ```tsx
   const { user } = useAuthContext();
   ```

**Company Pages:**

1. **Company/CompanyDashboard.tsx** → List posted internships:
   ```tsx
   const { data: internships } = useAsyncData(
     () => internshipService.listInternships(companyId),
     [companyId]
   );
   ```

2. **Company/Candidates.tsx** → Show followers:
   ```tsx
   const { data: followers } = useAsyncData(
     () => companyService.getFollowers(companyId),
     [companyId]
   );
   ```

**Landing Page:**

1. **Landing/LandingPage.tsx** → Show featured companies:
   ```tsx
   const { data: companies } = useAsyncData(
     () => companyService.listCompanies(3, 0),
     []
   );
   ```

### B. Verify Auth Flow (5 минут)

1. Откройте **src/contexts/AuthContext.tsx**
2. Убедитесь что login() правильно:
   - ✅ Вызывает authService.login()
   - ✅ Сохраняет token
   - ✅ Определяет role (student/company)
   - ✅ Сохраняет userId в localStorage
3. Тестируйте login/logout цикл

### C. Test API Integration (10 минут)

1. **Запустите backend** на localhost:8080
2. **Запустите frontend** (`npm run dev`)
3. **Тестируйте в этом порядке:**

   ```bash
   ✓ Sign Up (Student or Company)
   ✓ Login
   ✓ See internships list
   ✓ View internship details
   ✓ Follow/unfollow company
   ✓ Edit profile
   ✓ Logout
   ```

4. **Check Browser DevTools:**
   - Network tab: все requests должны быть 2xx
   - Console: нет ошибок
   - LocalStorage: token и userRole сохранены

### D. Error Handling Testing (5 минут)

1. **Выключите backend** и проверьте:
   - ✓ Показывается error message
   - ✓ Есть кнопка refetch/retry
   - ✓ Нет crash страницы

2. **Test 401 Unauthorized:**
   - Очистите localStorage.accessToken
   - Попробуйте вызвать protected endpoint
   - ✓ Должен редиректить на /auth/login

---

## 🔧 QUICK FIX: Если получите ошибку "Cannot find module"

Проблема может быть если файлы не экспортируются правильно.

**Решение:**

```bash
# 1. Проверьте src/api/index.ts экспортирует всё
cat src/api/index.ts

# Должно быть:
# export { apiClient } from "./client";
# export { authService, companyService, studentService, internshipService } from "./services";
# export * from "./types";

# 2. Обновите export если нужно:
# Отредактируйте src/api/index.ts
```

---

## 🌐 PRODUCTION DEPLOYMENT

### Before Going Live:

1. **Create .env.production:**
   ```env
   VITE_API_URL=https://your-api-domain.com
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Test build locally:**
   ```bash
   npm run preview
   ```

4. **Deploy to:**
   - Vercel, Netlify, GitHub Pages, или ваше облако
   - Убедитесь что backend API доступен с этого домена
   - Проверьте CORS settings на бэке

### Monitor in Production:

- Используйте browser console для проверки ошибок
- Добавьте Sentry/LogRocket для error tracking
- Мониторьте API response times

---

## 📚 USEFUL API ENDPOINTS REFERENCE

```
AUTH:
- POST /auth/api/v1/login

COMPANIES:
- GET  /company/api/v1/companies?limit=50&offset=0
- POST /company/api/v1/companies
- GET  /company/api/v1/companies/{id}
- PUT  /company/api/v1/companies/{id}
- DELETE /company/api/v1/companies/{id}
- GET  /company/api/v1/companies/{id}/followers

INTERNSHIPS:
- GET  /internship/api/v1/internships?limit=50&offset=0&companyId={id}
- POST /internship/api/v1/internships
- GET  /internship/api/v1/internships/{id}
- PUT  /internship/api/v1/internships/{id}
- DELETE /internship/api/v1/internships/{id}

STUDENTS:
- GET  /student/api/v1/students?limit=50&offset=0
- POST /student/api/v1/students
- GET  /student/api/v1/students/{id}
- PUT  /student/api/v1/students/{id}
- DELETE /student/api/v1/students/{id}

SUBSCRIPTIONS:
- POST /student/api/v1/companies/{id}/follow
- DELETE /student/api/v1/companies/{id}/follow
- GET  /student/api/v1/me/followed-companies

EDUCATION & EXPERIENCE:
- POST /student/api/v1/students/{id}/education
- PUT  /student/api/v1/students/{id}/education/{educationId}
- DELETE /student/api/v1/students/{id}/education/{educationId}
- POST /student/api/v1/students/{id}/experience
- PUT  /student/api/v1/students/{id}/experience/{experienceId}
- DELETE /student/api/v1/students/{id}/experience/{experienceId}
```

---

## 🎯 KEY POINTS TO REMEMBER

1. **Token Management:**
   - Token автоматически отправляется в `Authorization: Bearer {token}` header
   - При 401 - token удаляется и редиректит на login
   - Token сохранён в localStorage для persistence

2. **Error Handling:**
   - Всегда используйте try-catch в mutation handlers
   - Показывайте user-friendly error messages
   - Логируйте ошибки для отладки

3. **Loading States:**
   - Используйте loading флаг для disable кнопок
   - Показывайте скелетоны или spinners
   - Не позволяйте double-submit команд

4. **Типизация:**
   - Используйте типы из types.ts для всех API responses
   - Это поможет избежать runtime ошибок
   - TypeScript будет предупреждать о неправильном использовании

---

## ❓ TROUBLESHOOTING

| Проблема | Решение |
|---------|--------|
| CORS ошибка | Проверьте backend CORS config, backend должен разрешить ваш фронт домен |
| 401 Unauthorized | Проверьте что token правильно сохранён, возможно он истёк |
| "Cannot find module" | Проверьте что export/import пути правильные |
| Network takes too long | Возможно backend перегружен, добавьте timeout и retry механизм |
| Mock data всё ещё отображается | Убедитесь что заменили mock на real API call |

---

✅ **YOU'RE READY FOR PRODUCTION**

Следуйте этому плану и ваша интеграция будет production-ready! 🚀
