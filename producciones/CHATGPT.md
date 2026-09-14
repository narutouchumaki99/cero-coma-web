# Que ChatGPT publique solo

La web es estática. ChatGPT no puede “entrar” al dominio y guardar. Tiene que escribir en GitHub; Cloudflare publica solo.

Haces **esto una vez**. Luego, en el chat, le dices el cambio y sale en https://cerocomasoluciones.com/producciones/ al minuto.

## 1. Token (solo este repo)

1. Entra en GitHub con la cuenta `narutouchumaki99`.
2. [Fine-grained personal access token](https://github.com/settings/personal-access-tokens/new)
3. Nombre: `chatgpt-producciones`
4. Expiration: 90 días (o lo que quieras)
5. Resource owner: tú
6. Repository access: **Only select repositories** → `cero-coma-web`
7. Permissions → Repository → **Contents: Read and write**
8. Generate y copia el token (`github_pat_…`). No lo pegues en la web ni en un commit.

## 2. GPT propio en ChatGPT

1. ChatGPT → **Explorar GPT** → **Crear**
2. Nombre: `Producciones Cero Coma`
3. Instrucciones: pega el texto de [`gpt-instrucciones.md`](gpt-instrucciones.md)
4. **Acciones** → Importar desde archivo: [`gpt-openapi.yaml`](gpt-openapi.yaml)
   (o pega el YAML)
5. Autenticación de la acción: **API Key**
   - Auth type: **Bearer**
   - API Key: el token del paso 1
6. Create / Save
7. En **Privacidad**, déjalo solo para ti

## 3. Cómo se usa

Abre ese GPT y escribe, por ejemplo:

```
Cambia el lead de Producciones: que quede más corto.
Sustituye fotos/tartas/01-chocolate.jpg por la imagen que te acabo de generar.
```

Él lee el archivo, guarda el commit en `main` y Cloudflare lo saca.

## Si tienes ChatGPT Codex / Agent con GitHub

Conecta el repo `narutouchumaki99/cero-coma-web` y dile:

```
Lee producciones/EDITAR.md y aplica los cambios solo bajo producciones/.
Commit a main.
```

No hace falta el GPT del paso 2.
