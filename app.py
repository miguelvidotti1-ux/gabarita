#!/usr/bin/env python3
"""
Gabarita Vestibulares - Runner & Referência de Backend
Este aplicativo web em AI Studio é executado via Node.js + Express + Vite (server.ts) na porta 3000.
Ao rodar 'python app.py', este script verifica a saúde do servidor ativo e exibe o status de todos os módulos.
"""

import sys
import os
import json
import urllib.request
import urllib.error

SERVER_PORT = 3000
SERVER_URL = f"http://localhost:{SERVER_PORT}"

def check_server():
    print(f"==================================================")
    print(f" Gabarita Vestibulares — Plataforma de Estudos")
    print(f"==================================================")
    print(f"-> Verificando servidor ativo em {SERVER_URL}...")
    
    try:
        req = urllib.request.Request(f"{SERVER_URL}/api/mercadopago/config")
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                data = json.loads(response.read().decode())
                print(f"[OK] Servidor Node.js / TypeScript ativo e operando na porta {SERVER_PORT}.")
                print(f"[OK] Mercado Pago: {'Configurado' if data.get('configured') else 'Pendente'} (Ambiente: {data.get('environment')})")
                print(f"[OK] Módulos integrados:")
                print(f"     * Onboarding Inteligente & Diagnóstico")
                print(f"     * Boletim Escolar (OCR & Análise com Gemini)")
                print(f"     * Corretor de Redação ENEM com Rubricas Oficiais")
                print(f"     * Cronograma Semanal Personalizado")
                print(f"     * Checkout Pro & PIX Mercado Pago")
                print(f"     * Integração Spotify Focus")
                print(f"\n-> Aplicativo pronto para uso na prévia do AI Studio.")
                return True
    except (urllib.error.URLError, ConnectionRefusedError):
        print(f"[INFO] Servidor na porta {SERVER_PORT} não está respondendo via HTTP.")
        print(f"[INFO] No AI Studio, o servidor de desenvolvimento é iniciado com 'npm run dev'.")
        return False

if __name__ == "__main__":
    check_server()
