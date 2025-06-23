# Nome do usuário local (pode não ser necessário, dependendo do uso)
USERNAME = andressa

# Nome do host local (não está sendo usado, mas pode ser útil para comparações)
HOST = andressa

# Host remoto onde o deploy será feito (nome configurado no ~/.ssh/config ou IP)
HOST_RACCOON = raccoontech

# Alvo do Makefile chamado "deploy"
deploy:
	# Sincroniza os arquivos, excluindo node_modules, .env e uploads de produtos
	rsync -av \
		--exclude=node_modules \
		--exclude=.env \
		--exclude=public/uploads/imgs/products \
		--exclude=public/uploads/imgs/ticket \
		./ $(HOST_RACCOON):~/containers/raccoon-store-server

	# Sobe os containers no servidor
	ssh $(HOST_RACCOON) 'cd ~/containers/raccoon-store-server && docker compose up -d --build'
