<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .badge { display: inline-block; background: #6366f1; color: white; padding: 4px 12px; border-radius: 12px; font-size: 14px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        .info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Tu pedido ha sido enviado! 🚚</h1>
        </div>
        <div class="content">
            <p>Hola <strong>{{ $pedido->cliente->usuario->nombre }}</strong>,</p>
            <p>Tu pedido <strong>#{{ $pedido->id_pedido }}</strong> ya está en camino.</p>

            <div class="info">
                <p><strong>Número de pedido:</strong> #{{ $pedido->id_pedido }}</p>
                <p><strong>Estado:</strong> <span class="badge">Enviado</span></p>
                <p><strong>Total:</strong> Bs {{ number_format($pedido->total, 2) }}</p>
                @if($observacion)
                    <p><strong>Nota:</strong> {{ $observacion }}</p>
                @endif
            </div>

            <p>Gracias por confiar en NutriBalance.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} NutriBalance. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>

