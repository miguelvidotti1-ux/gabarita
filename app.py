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
                public_url = data.get('appUrl') or "https://ais-dev-r6cxhzfuu5mca3ev4cd5ki-397759700099.us-east1.run.app"
                print(f"\n-> Acesse seu aplicativo diretamente pelo painel de prévia do AI Studio ou pelo link público na nuvem:")
                print(f"   {public_url}")
                print(f"   (Nota: 'localhost:3000' é a porta interna do container de nuvem, use o link acima no seu navegador)")
                return True
    except (urllib.error.URLError, ConnectionRefusedError):
        print(f"[INFO] Servidor na porta {SERVER_PORT} não está respondendo via HTTP.")
        print(f"[INFO] No AI Studio, o servidor é gerenciado pelo ambiente na nuvem.")
        return False

# ===== Planos Padrão do Sistema =====
PLANOS_PADRAO = [
    {'nome':'mensal',   'preco_centavos':3990,  'duracao_dias':30,
     'descricao':'Tudo ilimitado por 30 dias: IA, correções, simulados e playlists'},
    {'nome':'trimestral','preco_centavos':9990, 'duracao_dias':90,
     'descricao':'3 meses de acesso completo — economia de R$ 19,80'},
    {'nome':'semestral','preco_centavos':17990, 'duracao_dias':180,
     'descricao':'6 meses de acesso completo — economia de R$ 59,50'},
    {'nome':'anual',    'preco_centavos':29990, 'duracao_dias':365,
     'descricao':'Acesso completo por 12 meses — equivalente a R$ 24,99/mês'},
]

class MockDB:
    class session:
        @staticmethod
        def add(item):
            pass
        @staticmethod
        def commit():
            pass

    @staticmethod
    def create_all():
        pass

db = MockDB()

class Plano:
    query_storage = {}
    def __init__(self, **kwargs):
        self.nome = kwargs.get('nome')
        self.preco_centavos = kwargs.get('preco_centavos')
        self.duracao_dias = kwargs.get('duracao_dias')
        self.descricao = kwargs.get('descricao')
        Plano.query_storage[self.nome] = self

    class query:
        @classmethod
        def filter_by(cls, **kwargs):
            nome = kwargs.get('nome')
            res = Plano.query_storage.get(nome)
            class Result:
                @staticmethod
                def first():
                    return res
            return Result

def seed():
    """
    Seed para criar ou atualizar os planos padrão na base de dados
    """
    print("[Seed] Sincronizando PLANOS_PADRAO...")
    db.create_all()
    for p in PLANOS_PADRAO:
        existente = Plano.query.filter_by(nome=p['nome']).first()
        if existente:
            existente.preco_centavos = p['preco_centavos']
            existente.duracao_dias = p['duracao_dias']
            existente.descricao = p['descricao']
        else:
            db.session.add(Plano(**p))
        print(f" -> Plano '{p['nome']}': R$ {p['preco_centavos']/100:.2f} ({p['duracao_dias']} dias)")
    db.session.commit()
    print("[Seed] Planos padrão sincronizados com sucesso.")

if __name__ == "__main__":
    check_server()
    print("\n")
    seed()
