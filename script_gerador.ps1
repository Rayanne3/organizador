# ===================================================================================
# GERADOR DE CONTEXTO DE PROJETO PARA IA
# Versão Premium 5.0
#
# Recursos:
# ✔ Ignora node_modules, .next, dist, build, etc
# ✔ Ignora imagens, fontes e binários
# ✔ Ignora o próprio arquivo gerado
# ✔ Compatível com PowerShell antigo
# ✔ Muito mais rápido usando ReadAllText()
# ✔ Estatísticas detalhadas
# ✔ UTF-8 correto
# ===================================================================================

try {

    # -------------------------------------------------------------------------
    # CONFIGURAÇÕES INICIAIS
    # -------------------------------------------------------------------------

    $OutputEncoding = [System.Text.Encoding]::UTF8

    $diretorioDoProjeto = $PSScriptRoot
    Set-Location $diretorioDoProjeto

    $outputFile = "projeto-completo-para-ia.txt"

    if (Test-Path $outputFile) {
        Remove-Item $outputFile -Force
    }

    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "GERADOR DE CONTEXTO PARA IA" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Projeto: $diretorioDoProjeto"
    Write-Host ""

    # -------------------------------------------------------------------------
    # EXTENSÕES QUE DEVEM SER INCLUÍDAS
    # -------------------------------------------------------------------------

    $extensoesParaIncluir = @(

        "*.html",
        "*.css",
        "*.scss",

        "*.js",
        "*.jsx",
        "*.ts",
        "*.tsx",

        "*.py",
        "*.java",
        "*.cs",
        "*.go",
        "*.rb",
        "*.php",

        "*.json",
        "*.xml",
        "*.yaml",
        "*.yml",
        "*.toml",

        "*.env",
        "*.env.*",

        "*.ini",
        "*.conf",

        "*.sql",

        "*.md",

        ".gitignore",
        ".prettierrc",

        "Dockerfile",
        "docker-compose.yml",

        "LICENSE",
        "README.md"
    )

    # -------------------------------------------------------------------------
    # PASTAS IGNORADAS
    # -------------------------------------------------------------------------

    $pastasParaIgnorar = @(

        "node_modules",
        ".next",
        "dist",
        "build",

        ".git",
        ".github",

        ".venv",
        "venv",

        "__pycache__",

        ".vscode",
        ".idea",

        ".turbo",
        ".vite",

        "coverage",

        ".wwebjs_auth",
        ".wwebjs_cache",
        ".baileys_auth",

        "logs",

        "public",

        "out"
    )

    # -------------------------------------------------------------------------
    # ARQUIVOS IGNORADOS
    # -------------------------------------------------------------------------

    $arquivosParaIgnorar = @(

        "package-lock.json",
        "yarn.lock",
        "pnpm-lock.yaml",

        $outputFile
    )

    # -------------------------------------------------------------------------
    # PASSO 1 - LOCALIZAR PASTAS IGNORADAS
    # -------------------------------------------------------------------------

    Write-Host "PASSO 1 - Procurando pastas ignoradas..." -ForegroundColor Yellow

    $pastasExcluidasEncontradas =
        Get-ChildItem -Path $diretorioDoProjeto -Directory -Recurse -ErrorAction SilentlyContinue |
        Where-Object {
            $pastasParaIgnorar -contains $_.Name
        }

    $caminhosExcluidos = $pastasExcluidasEncontradas.FullName

    if ($caminhosExcluidos.Count -gt 0) {

        Write-Host ""
        Write-Host "Pastas ignoradas:" -ForegroundColor DarkYellow

        foreach ($pasta in $pastasExcluidasEncontradas) {

            $relativo =
                $pasta.FullName.Replace(
                    $diretorioDoProjeto,
                    ""
                ).TrimStart("\","/")

            Write-Host "  - $relativo"
        }
    }

    Write-Host ""

    # -------------------------------------------------------------------------
    # PASSO 2 - COLETAR ARQUIVOS
    # -------------------------------------------------------------------------

    Write-Host "PASSO 2 - Coletando arquivos..." -ForegroundColor Yellow

    $todosOsArquivosDoProjeto =
        Get-ChildItem `
            -Path $diretorioDoProjeto `
            -File `
            -Recurse `
            -Include $extensoesParaIncluir `
            -ErrorAction SilentlyContinue

    Write-Host ""
    Write-Host "Arquivos encontrados inicialmente: $($todosOsArquivosDoProjeto.Count)" -ForegroundColor Cyan

    # -------------------------------------------------------------------------
    # PASSO 3 - FILTRAR
    # -------------------------------------------------------------------------

    Write-Host ""
    Write-Host "PASSO 3 - Aplicando filtros..." -ForegroundColor Yellow

    $arquivosFinais =
        $todosOsArquivosDoProjeto | Where-Object {

            $arquivo = $_

            # Ignorar arquivos específicos

            if ($arquivosParaIgnorar -contains $arquivo.Name) {
                return $false
            }

            # Ignorar pastas excluídas

            foreach ($pasta in $caminhosExcluidos) {

                if ($arquivo.FullName.StartsWith($pasta)) {
                    return $false
                }
            }

            return $true
        }

    Write-Host ""
    Write-Host "Arquivos finais: $($arquivosFinais.Count)" -ForegroundColor Green

    if ($arquivosFinais.Count -eq 0) {

        Write-Host ""
        Write-Host "Nenhum arquivo encontrado após os filtros." -ForegroundColor Red
        return
    }

    # -------------------------------------------------------------------------
    # PASSO 4 - GERAR ARQUIVO
    # -------------------------------------------------------------------------

    Write-Host ""
    Write-Host "PASSO 4 - Gerando arquivo final..." -ForegroundColor Yellow

    $writer =
        New-Object System.IO.StreamWriter(
            $outputFile,
            $false,
            [System.Text.Encoding]::UTF8
        )

    $totalLinhas = 0

    foreach ($arquivo in $arquivosFinais) {

        try {

            $caminhoRelativo =
                $arquivo.FullName.Substring(
                    $diretorioDoProjeto.Length
                ).TrimStart("\","/")

            Write-Host "Processando: $caminhoRelativo"

            $conteudo =
                [System.IO.File]::ReadAllText(
                    $arquivo.FullName
                )

            $writer.WriteLine("")
            $writer.WriteLine("======================================================")
            $writer.WriteLine("ARQUIVO: $caminhoRelativo")
            $writer.WriteLine("======================================================")
            $writer.WriteLine("")
            $writer.WriteLine($conteudo)
            $writer.WriteLine("")
            $writer.WriteLine("FIM DO ARQUIVO: $caminhoRelativo")
            $writer.WriteLine("")
            $writer.WriteLine("")

            $totalLinhas += ($conteudo -split "`n").Count
        }
        catch {

            Write-Host ""
            Write-Host "Falha ao ler: $($arquivo.FullName)" -ForegroundColor Red
        }
    }

    $writer.Close()

    # -------------------------------------------------------------------------
    # RESULTADO
    # -------------------------------------------------------------------------

    $tamanhoMB =
        [Math]::Round(
            ((Get-Item $outputFile).Length / 1MB),
            2
        )

    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "CONCLUÍDO" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host ""

    Write-Host "Arquivo: $outputFile"
    Write-Host "Arquivos incluídos: $($arquivosFinais.Count)"
    Write-Host "Linhas aproximadas: $totalLinhas"
    Write-Host "Tamanho: $tamanhoMB MB"

    Write-Host ""
    Write-Host "Localização:"
    Write-Host (Resolve-Path $outputFile)

}
catch {

    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Red
    Write-Host "ERRO" -ForegroundColor Red
    Write-Host "==========================================================" -ForegroundColor Red
    Write-Host ""

    Write-Host $_.Exception.Message -ForegroundColor Red
}
finally {

    Write-Host ""
    Write-Host "Pressione ENTER para sair..."
    Read-Host | Out-Null
}