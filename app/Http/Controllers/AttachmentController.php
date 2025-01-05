<?php

namespace App\Http\Controllers;

use App\Http\Requests\AttachmentRequest;
use App\Models\Attachment;
use App\Models\Card;
use App\Traits\HasFile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AttachmentController extends Controller
{
    use HasFile;
    public function store(Card $card, AttachmentRequest $request): RedirectResponse
    {
        $request->user()->attachments()->create([
            'card_id' => $card->id,
            'file' => $this->upload_file($request, 'file', 'attachments'),
            'link' => $request->link,
            'name' => $request->name
        ]);

        flashMessage('Attachment was saved successfully');
        return back();
    }

    public function destroy(Card $card, Attachment $attachment): RedirectResponse
    {
        $this->delete_file($attachment, 'file');
        
        $attachment->delete();
        flashMessage('The attachment was successfully deleted.');

        return back();
    }
}
