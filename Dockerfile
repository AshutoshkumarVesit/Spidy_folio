FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
COPY package.json server.mjs public-knowledge.mjs ./
COPY index.html style.css play.css reveal.js triangles.js sections.js navigation.js spider-cursor.js motion-details.js portfolio-play.js web-swing.js swing-world.mjs spidy-chat.js ./
COPY assets ./assets
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.mjs"]
