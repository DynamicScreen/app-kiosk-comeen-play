import {defineComponent, h, PropType} from "vue";
import {Media} from "@comeen/comeen-play-sdk-js";
import MediaItem from "./MediaItem";

export default defineComponent({
    props: {
        medias: {type: Array as PropType<Partial<{ filename: string, url: string, mime: string }>[]>, required: true}
    },
    emits: ["closeFolder"],
    setup(props, {emit}) {
        const {computed, ref, Suspense} = window.kiosk.vue;
        const {t} = window.kiosk;

        const renderMedia = (media: Partial<{filename: string, url: string, mime: string}>) => {
            return h(Suspense, null, {
                default: () => h(MediaItem, {
                    name: media?.filename ?? "",
                    url: media?.url ?? "",
                    type: media.mime?.split('/')[0] ?? "image"
                }),
                fallback: () => h("div", {
                    class: "animate-pulse w-full h-16 flex flex-row items-center"
                }, [
                    h("div", {
                        class: "w-10 h-10 bg-slate-700 rounded-lg"
                    }),
                    h("div", {
                        class: "bg-slate-700 w-full h-8 rounded-xl"
                    })
                ])
            })
        }

        return () => h("div", {
            class: "w-full h-full pt-12"
        }, [
            h("div", {
                class: "w-3/4 h-full flex flex-col overflow-y-scroll"
            }, [
                h("div", {
                    class: "flex flex-row space-x-3 items-center pb-6"
                }, [
                    h("div", {
                        class: "",
                        onClick: () => emit("closeFolder"),
                    }, [
                        h("i", {
                            class: "fa-solid fa-arrow-left text-2xl text-gray-600 cursor-pointer"
                        }),
                    ]),
                    h("span", {
                        class: "font-semibold text-3xl text-gray-600"
                    }, t('modules.kiosk.options.view.select_file'))
                ]),
                props.medias.map((media: Partial<{ filename: string, url: string, mime: string }>) => renderMedia(media))
            ]),
        ])
    }
})