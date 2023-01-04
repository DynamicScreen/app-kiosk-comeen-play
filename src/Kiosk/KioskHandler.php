<?php

namespace Comeen\Kiosk\Kiosk;

use ComeenPlay\SdkPhp\Handlers\SlideHandler;
use ComeenPlay\SdkPhp\Interfaces\ISlide;
use ComeenPlay\SdkPhp\Interfaces\IDisplay;
use ComeenPlay\SdkPhp\Modules\LibraryModule;
use Illuminate\Support\Arr;

class KioskHandler extends SlideHandler
{
    public function fetch(ISlide $slide, IDisplay $display): void
    {
        $list = LibraryModule::listFolders($display);
        $categoriesOptions = $slide->getOption("categories", []);

        foreach ($categoriesOptions as $key => $category) {
            if ($category["type"] === "folders") {
                if (!is_array($category["folders"])) {
                    $category["folders"] = json_decode($category["folders"], false);
                }

                $categoryFolders = $category["folders"];
                $medias = [];
                foreach ($categoryFolders as $idFolder) {
                    $listFoldersId = array_column($list->folders, "id");
                    $folderId = array_search((int) $idFolder, $listFoldersId);
                    array_push($medias, $list->folders[$folderId]);
                }
                $categoriesOptions[$key]["folders"] = $medias;
            } else if($category["type"] === "links") {
                if (!is_array($category["links"])) {
                    $categoriesOptions[$key]["links"] = json_decode($category["links"], true);
                }
            }
        }

       $mediasAccessKey = $this->needed_medias();

       if (is_array($mediasAccessKey)) {
           $mediasAccessKey = Arr::first($mediasAccessKey);
       }

       $bg_media = collect($slide->getMedia($mediasAccessKey))->first();

        $this->addSlide([
            'categories' => $categoriesOptions,
            'notification_duration' => $slide->getOption("notification_duration", null),
            'background' => Arr::get($bg_media, 'url'),
        ]);
    }

    public function getValidations($options = null): array
    {
        return [];
    }
}
