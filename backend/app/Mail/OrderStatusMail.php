<?php

namespace App\Mail;

use App\Models\Pedido;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public Pedido $pedido;
    public string $estadoAnterior;
    public string $estadoNuevo;
    public ?string $observacion;

    public function __construct(Pedido $pedido, string $estadoAnterior, string $estadoNuevo, ?string $observacion = null)
    {
        $this->pedido = $pedido;
        $this->estadoAnterior = $estadoAnterior;
        $this->estadoNuevo = $estadoNuevo;
        $this->observacion = $observacion;
    }

    public function envelope(): Envelope
    {
        $subject = match ($this->estadoNuevo) {
            'enviado' => 'Tu pedido ha sido enviado',
            'entregado' => 'Tu pedido ha sido entregado',
            default => 'Estado de tu pedido actualizado',
        };

        return new Envelope(
            subject: $subject . ' - NutriBalance',
        );
    }

    public function content(): Content
    {
        return new Content(
            html: match ($this->estadoNuevo) {
                'enviado' => 'emails.pedido-enviado',
                'entregado' => 'emails.pedido-entregado',
                default => 'emails.pedido-actualizado',
            },
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
