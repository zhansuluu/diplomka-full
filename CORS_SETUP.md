# CORS Configuration for Go Backend

## Ошибка
```
Access to fetch at 'http://localhost:8080/student/api/v1/students' from origin 'http://localhost:5173' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header
```

## Решение для Go

### Вариант 1: Используя github.com/rs/cors (рекомендуется)

**1. Установить пакет:**
```bash
go get github.com/rs/cors
```

**2. В main.go или server setup:**
```go
package main

import (
    "github.com/rs/cors"
    "net/http"
)

func main() {
    // Ваш router (gin, chi, mux и т.д.)
    router := setupRouter() // ваша функция инициализации

    // CORS middleware
    c := cors.New(cors.Options{
        AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:5174"}, // фронт
        AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
        AllowedHeaders:   []string{"Accept", "Content-Type", "Authorization"},
        ExposedHeaders:   []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           300,
    })

    // Оборачиваем router в CORS middleware
    handler := c.Handler(router)
    
    http.ListenAndServe(":8080", handler)
}
```

### Вариант 2: Если используете Gin

```go
package main

import "github.com/gin-gonic/gin"

func main() {
    router := gin.Default()

    // CORS middleware
    router.Use(func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Authorization")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    })

    // Ваши routes
    setupRoutes(router)

    router.Run(":8080")
}
```

### Вариант 3: Если используете Chi

```go
package main

import (
    "github.com/go-chi/chi"
    "github.com/go-chi/cors"
)

func main() {
    router := chi.NewRouter()

    // CORS
    router.Use(cors.Handler(cors.Options{
        AllowedOrigins:   []string{"http://localhost:5173"},
        AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
        AllowedHeaders:   []string{"Accept", "Content-Type", "Authorization"},
        ExposedHeaders:   []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           300,
    }))

    // Ваши routes
    setupRoutes(router)

    http.ListenAndServe(":8080", router)
}
```

## Для production

Не допускайте `AllowedOrigins: []string{"*"}` - это небезопасно!

Используйте:
```go
AllowedOrigins: []string{
    "http://localhost:5173",      // для разработки
    "https://yourdomain.com",     // production
    "https://app.yourdomain.com", // вариант с поддоменом
}
```

## Альтернатива: Прокси через Vite

Если не можете изменить бэк, добавьте в `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
```

Тогда на фронте меняем:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
```

Вместо `http://localhost:8080` используются `/api` calls (они проксируются на бэк).
