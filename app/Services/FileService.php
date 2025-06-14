<?php

namespace App\Services;
use Illuminate\Support\Facades\Storage;

use Illuminate\Http\UploadedFile;

class FileService
{
    /**
     * Upload a file to the specified folder and subfolder in the 'public' disk.
     *
     * @param UploadedFile $file
     * @param string $folder
     * @param string|null $subfolder
     * @return array
     */
    public function upload(UploadedFile $file, string $folder, ?string $subfolder = ''): array
    {
        $path = $file->store(
            trim($folder . '/' . $subfolder, '/'),
            'public' // uses 'storage/app/public'
        );

        return [
            'file_path' => $path,
            'file_url'  => asset('storage/' . $path)
        ];
    }

    public function generateUrl($filePath)
{
    $filePath = ltrim($filePath, '/');
    return url('storage/' . $filePath);
}

}
