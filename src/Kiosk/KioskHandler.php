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
                $categoryFolders = $category["folders"];
                $medias = [];
                foreach ($categoryFolders as $idFolder) {
                    $listFoldersId = array_column($list->folders, "id");
                    $folderId = array_search((int) $idFolder, $listFoldersId);
                    array_push($medias, $list->folders[$folderId]);
                }
                $categoriesOptions[$key]["folders"] = $medias;
            }
        }

//        $mediasAccessKey = $this->needed_medias();
//
//        if (is_array($mediasAccessKey)) {
//            $mediasAccessKey = Arr::first($mediasAccessKey);
//        }
//
//        dd($slide->getMedias());
//        $bg_media = $slide->getMedias($mediasAccessKey);

        $this->addSlide([
            'categories' => $categoriesOptions,
            'notification_duration' => $slide->getOption("notification_duration", null)
        ]);
    }

    public function getValidations($options = null): array
    {
        return [];
    }
}
