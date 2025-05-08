# Nome do usuário local (pode não ser necessário, dependendo do uso)
USERNAME = andressa

# Nome do host local (não está sendo usado, mas pode ser útil para comparações)
HOST = andressa

# Host remoto onde o deploy será feito (nome configurado no ~/.ssh/config ou IP)
HOST_RACCOON = raccoontech

# Alvo do Makefile chamado "deploy"
deploy:
	# Remove todos os arquivos e pastas (inclusive ocultos) dentro da pasta remota raccoon-store-server, mas mantém a pasta
	ssh $(HOST_RACCOON) 'rm -rf ~/containers/raccoon-store-server/* ~/containers/raccoon-store-server/.[!.]* ~/containers/raccoon-store-server/..?*'

	# Envia todos os arquivos da pasta atual para o servidor remoto, exceto node_modules e public/uploads/imgs/products
	# -a: preserva permissões, timestamps, etc.
	# -v: modo verboso (mostra o que está sendo enviado)
	# --exclude: exclui diretórios específicos do envio
	rsync -av \
		--exclude=node_modules \
		--exclude=public/uploads/imgs/products \
		./ $(HOST_RACCOON):~/containers/raccoon-store-server

	# Após copiar os arquivos, acessa o servidor remoto, entra na pasta do projeto e executa o docker compose para (re)subir os containers
	ssh $(HOST_RACCOON) 'cd ~/containers/raccoon-store-server && docker compose up -d --build'
