export function movieAvailableTemplate(
  movieName: string,
  watchUrl: string,
): string {
  return `
   <!DOCTYPE html>
   <html lang="pt-BR" style="margin:0; padding:0;">
   <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1" />
     <title>Filme Disponível!</title>
     <style>
       body {
         background: linear-gradient(135deg, #1f1c2c, #928dab);
         font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
         color: #f5f5f5;
         margin: 0;
         padding: 0;
       }
       .container {
         max-width: 600px;
         margin: 40px auto;
         background: #2c2a48;
         border-radius: 12px;
         box-shadow: 0 8px 20px rgba(0,0,0,0.3);
         overflow: hidden;
         padding: 30px 40px;
         text-align: center;
       }
       h1 {
         font-size: 2.8rem;
         margin-bottom: 10px;
         color: #ffd700;
         text-shadow: 0 0 10px #ffd700;
       }
       p {
         font-size: 1.2rem;
         line-height: 1.6;
         margin-bottom: 30px;
         color: #ddd;
       }
       .btn {
         display: inline-block;
         background: #ffd700;
         color: #2c2a48;
         font-weight: bold;
         padding: 15px 35px;
         border-radius: 30px;
         text-decoration: none;
         font-size: 1.1rem;
         box-shadow: 0 4px 15px rgba(255, 215, 0, 0.6);
         transition: background 0.3s ease;
       }
       .btn:hover {
         background: #e6c200;
         box-shadow: 0 6px 20px rgba(230, 194, 0, 0.8);
       }
       .footer {
         margin-top: 40px;
         font-size: 0.9rem;
         color: #777;
       }
     </style>
   </head>
   <body>
     <div class="container">
       <h1>🎬 O Filme "${movieName}" Que Você Esperava Está Aqui!</h1>
       <p>Prepare a pipoca e acomode-se! O filme que você estava aguardando acaba de ficar disponível no nosso site. Não perca tempo e assista agora mesmo.</p>
       <a href="${watchUrl}" target="_blank" class="btn">Ver Filme Agora</a>
       <div class="footer">
         <p>Obrigado por usar nosso serviço de aviso de lançamentos. Boa sessão!</p>
       </div>
     </div>
   </body>
   </html>
   `
}
