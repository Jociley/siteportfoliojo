"use client"

import { useState, useEffect } from "react"

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "hr" | "viewer"
  department: string
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  field: string
  oldValue: string
  newValue: string
  timestamp: Date
}

class AuthSystem {
  private currentUser: User | null = null
  private auditLogs: AuditLog[] = []

  login(email: string, password: string): User | null {
    // Simulação de autenticação - em produção usar sistema real
    const users: Record<string, { user: User; password: string }> = {
      "admin@safetrack.com": {
        user: {
          id: "1",
          name: "Admin SafeTrack",
          email: "admin@safetrack.com",
          role: "admin",
          department: "Administração",
        },
        password: "admin123",
      },
      "rh@safetrack.com": {
        user: { id: "2", name: "Gestor RH", email: "rh@safetrack.com", role: "hr", department: "Recursos Humanos" },
        password: "rh123",
      },
      "viewer@safetrack.com": {
        user: {
          id: "3",
          name: "Visualizador",
          email: "viewer@safetrack.com",
          role: "viewer",
          department: "Operacional",
        },
        password: "viewer123",
      },
    }

    const userData = users[email]
    if (userData && userData.password === password) {
      this.currentUser = userData.user
      this.logAction("login", "sistema", "", "Usuário logado")
      return userData.user
    }
    return null
  }

  logout() {
    if (this.currentUser) {
      this.logAction("logout", "sistema", "", "Usuário deslogado")
      this.currentUser = null
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  canEdit(field: string): boolean {
    if (!this.currentUser) return false

    switch (this.currentUser.role) {
      case "admin":
        return true
      case "hr":
        // RH pode editar títulos e metas, mas não resultados
        return ["titles", "goals", "descriptions"].includes(field)
      case "viewer":
        return false
      default:
        return false
    }
  }

  logAction(action: string, field: string, oldValue: string, newValue: string) {
    if (!this.currentUser) return

    const log: AuditLog = {
      id: Date.now().toString(),
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      action,
      field,
      oldValue,
      newValue,
      timestamp: new Date(),
    }

    this.auditLogs.push(log)

    // Manter apenas os últimos 100 logs
    if (this.auditLogs.length > 100) {
      this.auditLogs = this.auditLogs.slice(-100)
    }
  }

  getAuditLogs(): AuditLog[] {
    return [...this.auditLogs].reverse() // Mais recentes primeiro
  }
}

export const authSystem = new AuthSystem()

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Verificar se há usuário logado ao inicializar
    const currentUser = authSystem.getCurrentUser()
    setUser(currentUser)
  }, [])

  const login = (email: string, password: string): User | null => {
    const loggedUser = authSystem.login(email, password)
    setUser(loggedUser)
    return loggedUser
  }

  const logout = () => {
    authSystem.logout()
    setUser(null)
  }

  const canEdit = (field: string): boolean => {
    return authSystem.canEdit(field)
  }

  const logAction = (action: string, field: string, oldValue: string, newValue: string) => {
    authSystem.logAction(action, field, oldValue, newValue)
  }

  const getAuditLogs = (): AuditLog[] => {
    return authSystem.getAuditLogs()
  }

  return {
    user,
    login,
    logout,
    canEdit,
    logAction,
    getAuditLogs,
  }
}
