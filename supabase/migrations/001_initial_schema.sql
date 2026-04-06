-- ============================================
-- LotoLogic - Schema Inicial
-- ============================================

-- Resultados das loterias (histórico completo)
CREATE TABLE IF NOT EXISTS resultados (
  id SERIAL PRIMARY KEY,
  loteria VARCHAR(20) NOT NULL,
  concurso INTEGER NOT NULL,
  data DATE,
  numeros JSONB NOT NULL,
  premio_acumulado DECIMAL(15,2) DEFAULT 0,
  acumulou BOOLEAN DEFAULT false,
  ganhadores JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(loteria, concurso)
);

CREATE INDEX idx_resultados_loteria ON resultados(loteria);
CREATE INDEX idx_resultados_concurso ON resultados(loteria, concurso DESC);
CREATE INDEX idx_resultados_data ON resultados(data DESC);

-- Perfis de usuários (extensão do auth.users)
CREATE TABLE IF NOT EXISTS perfis (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(255),
  email VARCHAR(255),
  loterias_favoritas JSONB DEFAULT '["megasena"]',
  loteria_principal VARCHAR(20) DEFAULT 'megasena',
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jogos salvos pelos usuários
CREATE TABLE IF NOT EXISTS jogos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
  loteria VARCHAR(20) NOT NULL,
  nome VARCHAR(255) DEFAULT 'Meu Jogo',
  numeros JSONB NOT NULL,
  estrategia VARCHAR(50) DEFAULT 'aleatorio',
  score DECIMAL(5,2),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_jogos_user ON jogos(user_id);
CREATE INDEX idx_jogos_loteria ON jogos(user_id, loteria);

-- Conferências automáticas
CREATE TABLE IF NOT EXISTS conferencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jogo_id UUID NOT NULL REFERENCES jogos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
  loteria VARCHAR(20) NOT NULL,
  concurso INTEGER NOT NULL,
  acertos INTEGER NOT NULL DEFAULT 0,
  numeros_acertados JSONB DEFAULT '[]',
  premio DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(jogo_id, concurso)
);

CREATE INDEX idx_conferencias_user ON conferencias(user_id);

-- Anúncios (AdSense + VIP)
CREATE TABLE IF NOT EXISTS anuncios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('adsense', 'vip')),
  nome VARCHAR(255) NOT NULL,
  posicao VARCHAR(50) NOT NULL DEFAULT 'sidebar',
  codigo TEXT,
  url_destino VARCHAR(500),
  imagem_url VARCHAR(500),
  ativo BOOLEAN DEFAULT true,
  impressoes INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracking de visitas
CREATE TABLE IF NOT EXISTS visitas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pagina VARCHAR(255) NOT NULL,
  referrer VARCHAR(500),
  user_agent TEXT,
  ip VARCHAR(45),
  user_id UUID REFERENCES perfis(id),
  session_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_visitas_data ON visitas(created_at DESC);
CREATE INDEX idx_visitas_pagina ON visitas(pagina, created_at DESC);

-- Clicks em anúncios
CREATE TABLE IF NOT EXISTS clicks_anuncios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anuncio_id UUID NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
  user_id UUID REFERENCES perfis(id),
  ip VARCHAR(45),
  pagina VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clicks_anuncio ON clicks_anuncios(anuncio_id, created_at DESC);

-- Configurações do sistema (editáveis pelo admin)
CREATE TABLE IF NOT EXISTS config_sistema (
  chave VARCHAR(100) PRIMARY KEY,
  valor TEXT DEFAULT '',
  descricao VARCHAR(255),
  tipo VARCHAR(20) DEFAULT 'text',
  grupo VARCHAR(50) DEFAULT 'geral',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed de configurações
INSERT INTO config_sistema (chave, valor, descricao, tipo, grupo) VALUES
  ('gemini_api_key', '', 'API Key do Google Gemini AI Studio', 'password', 'ai'),
  ('openrouter_api_key', '', 'API Key do OpenRouter (fallback)', 'password', 'ai'),
  ('ai_model_primary', 'gemini-2.0-flash', 'Modelo primário de IA', 'text', 'ai'),
  ('ai_model_fallback', 'deepseek/deepseek-chat-v3-0324:free', 'Modelo fallback (OpenRouter)', 'text', 'ai'),
  ('resend_api_key', '', 'API Key do Resend', 'password', 'email'),
  ('smtp_from', 'suporte@dantetesta.com.br', 'Email remetente', 'text', 'email'),
  ('adsense_client_id', '', 'ID do cliente Google AdSense', 'text', 'anuncios'),
  ('site_nome', 'LotoLogic', 'Nome do site', 'text', 'geral'),
  ('site_descricao', 'Análise inteligente de loterias da CAIXA', 'Descrição (SEO)', 'text', 'geral'),
  ('site_keywords', 'loteria, mega-sena, lotofácil, análise, gerador, estatísticas', 'Keywords (SEO)', 'text', 'geral'),
  ('manutencao', 'false', 'Modo manutenção', 'boolean', 'geral'),
  ('registro_aberto', 'true', 'Permitir novos cadastros', 'boolean', 'geral')
ON CONFLICT (chave) DO NOTHING;

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE resultados ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE jogos ENABLE ROW LEVEL SECURITY;
ALTER TABLE conferencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE anuncios ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks_anuncios ENABLE ROW LEVEL SECURITY;
ALTER TABLE config_sistema ENABLE ROW LEVEL SECURITY;

-- Resultados: leitura pública
CREATE POLICY "resultados_select" ON resultados FOR SELECT USING (true);
CREATE POLICY "resultados_insert" ON resultados FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM perfis WHERE id = auth.uid() AND is_admin = true)
);

-- Perfis: usuário vê/edita o próprio
CREATE POLICY "perfis_select_own" ON perfis FOR SELECT USING (id = auth.uid());
CREATE POLICY "perfis_update_own" ON perfis FOR UPDATE USING (id = auth.uid());
CREATE POLICY "perfis_insert_own" ON perfis FOR INSERT WITH CHECK (id = auth.uid());
-- Admin vê todos
CREATE POLICY "perfis_admin_select" ON perfis FOR SELECT USING (
  EXISTS (SELECT 1 FROM perfis WHERE id = auth.uid() AND is_admin = true)
);

-- Jogos: usuário vê/edita os próprios
CREATE POLICY "jogos_select_own" ON jogos FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "jogos_insert_own" ON jogos FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "jogos_delete_own" ON jogos FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "jogos_update_own" ON jogos FOR UPDATE USING (user_id = auth.uid());

-- Conferencias: usuário vê as próprias
CREATE POLICY "conferencias_select_own" ON conferencias FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "conferencias_insert_own" ON conferencias FOR INSERT WITH CHECK (user_id = auth.uid());

-- Anúncios: leitura pública (ativos), escrita admin
CREATE POLICY "anuncios_select_ativos" ON anuncios FOR SELECT USING (ativo = true);
CREATE POLICY "anuncios_admin_all" ON anuncios FOR ALL USING (
  EXISTS (SELECT 1 FROM perfis WHERE id = auth.uid() AND is_admin = true)
);

-- Visitas: insert público via service role, select admin
CREATE POLICY "visitas_admin_select" ON visitas FOR SELECT USING (
  EXISTS (SELECT 1 FROM perfis WHERE id = auth.uid() AND is_admin = true)
);

-- Clicks: insert público via service role, select admin
CREATE POLICY "clicks_admin_select" ON clicks_anuncios FOR SELECT USING (
  EXISTS (SELECT 1 FROM perfis WHERE id = auth.uid() AND is_admin = true)
);

-- Config: somente admin
CREATE POLICY "config_admin_all" ON config_sistema FOR ALL USING (
  EXISTS (SELECT 1 FROM perfis WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "config_public_read" ON config_sistema FOR SELECT USING (
  tipo != 'password'
);

-- ============================================
-- Functions
-- ============================================

-- Trigger: criar perfil ao registrar
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO perfis (id, email, nome)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function: incrementar impressões de anúncio
CREATE OR REPLACE FUNCTION incrementar_impressao(anuncio_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE anuncios SET impressoes = impressoes + 1 WHERE id = anuncio_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: registrar click em anúncio
CREATE OR REPLACE FUNCTION registrar_click(
  p_anuncio_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_ip VARCHAR DEFAULT NULL,
  p_pagina VARCHAR DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE anuncios SET clicks = clicks + 1 WHERE id = p_anuncio_id;
  INSERT INTO clicks_anuncios (anuncio_id, user_id, ip, pagina)
  VALUES (p_anuncio_id, p_user_id, p_ip, p_pagina);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
