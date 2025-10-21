# 🔧 Correção do Endpoint de Permissões

## 📋 Correção Realizada

O endpoint para buscar permissões do curso foi corrigido de `/permissoes/{cursoId}` para `/cursos/permissoes/{cursoId}`.

---

## ✅ Alteração

**Arquivo:** `src/app/features/cursos/services/cursos.service.ts`

### **ANTES (Incorreto):**
```typescript
getCoursePermissions(cursoId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/permissoes/${cursoId}`);
}
```

**URL gerada:** `http://localhost:8080/api/permissoes/1` ❌

---

### **DEPOIS (Correto):**
```typescript
getCoursePermissions(cursoId: number): Observable<any[]> {
  console.log('👥 Buscando permissões do curso ID:', cursoId);
  console.log('📡 URL:', `${this.baseUrl}/cursos/permissoes/${cursoId}`);
  return this.http.get<any[]>(`${this.baseUrl}/cursos/permissoes/${cursoId}`);
}
```

**URL gerada:** `http://localhost:8080/api/cursos/permissoes/1` ✅

---

## 📊 **Endpoint Correto**

### **Request:**
```http
GET /api/cursos/permissoes/3
Authorization: Bearer eyJ...
```

### **Response:**
```json
[
  {
    "cursoId": 3,
    "usuarioId": 1,
    "usuarioNome": "João Silva",
    "permissao": "ADMINISTRADOR"
  },
  {
    "cursoId": 3,
    "usuarioId": 2,
    "usuarioNome": "Maria Santos",
    "permissao": "GERENTE"
  }
]
```

---

## 🔐 **Autorização**

```java
@GetMapping("/permissoes/{cursoId}")
@PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('GERENTE') or hasRole('SECRETARIO')")
```

**Acesso:**
- ✅ ADMINISTRADOR
- ✅ GERENTE
- ✅ SECRETARIO

---

## 📝 **Logs Adicionados**

Agora ao chamar o método, verá no console:
```
👥 Buscando permissões do curso ID: 3
📡 URL: http://localhost:8080/api/cursos/permissoes/3
```

---

## ✅ **Status**

**Endpoint corrigido com sucesso!**

✅ URL correta: `/api/cursos/permissoes/{cursoId}`  
✅ Logs adicionados para debug  
✅ Pronto para testar  

**Reinicie o servidor e teste novamente!** 🚀✨

---

**Data da Correção:** 20 de outubro de 2025  
**Arquivo Modificado:** `cursos.service.ts`  
**Status:** ✅ **CONCLUÍDO**



