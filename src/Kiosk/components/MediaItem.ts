import {defineComponent, h, onUnmounted, PropType, Suspense, toDisplayString} from "vue";
import PreviewImageModal from "./PreviewImageModal";
import PreviewVideoModal from "./PreviewVideoModal";
import PreviewPDFModal from "./PreviewPDFModal";
import moment from "moment";
import { IAssetsStorageAbility } from "@comeen/comeen-play-sdk-js";

const loadMedia = (url: string) => {
    return new Promise(async (resolve, reject) => {
        const context = window.kiosk.context;
        const ability = await context.assetsStorage();
        const asset = await ability.getDisplayableAsset(url);
        // setTimeout(() => {
        //     resolve(asset.displayableUrl());
        // }, 5000 * 10000)
        resolve(asset.displayableUrl());
    })

}

export default defineComponent({
    props: {
        url: {type: String, required: true},
        name: {type: String, required: true},
        type: {type: String, required: true},
        created_at: {type: String},
        updated_at: {type: String},
        page: {type: Number, default: 1}
    },
    async setup(props) {
        const {ref, toRef, computed} = window.kiosk.vue;
        const {context} = window.kiosk
        const mediaType = toRef(props, "type");
        const displayableUrl = ref(await loadMedia(props.url));

        const previewMedia = () => {
            if (mediaType.value === "video") {
                context.modal.showModal(PreviewVideoModal, {urlToDisplay: displayableUrl, name: props.name});
            } else if (mediaType.value === "application") {
                context.modal.showModal(PreviewPDFModal, {urlToDisplay: displayableUrl, page: props.page, name: props.name});
            } else {
                context.modal.showModal(PreviewImageModal, {urlToDisplay: displayableUrl, name: props.name});
            }
        }

        const renderItemPreview = () => {
            console.log("MEDIA TYPE", mediaType.value)
            if (mediaType.value === "video") {
                return h("div", {
                    class: "w-10 h-10 relative bg-gray-200 flex items-center justify-center rounded-lg"
                },[
                    renderNotificationBuble(),
                    h("i", {
                        class: "fa-solid fa-video text-gray-700"
                    })
                ])
            } else if (mediaType.value === "application") {
                return h("div", {
                    class: "w-10 h-10 relative bg-gray-200 flex items-center justify-center rounded-lg"
                },[
                    renderNotificationBuble(),
                    h("i", {
                        class: "fa-sharp fa-solid fa-file-pdf text-gray-700"
                    })
                ])
            } else {
                return h("div", {class: "relative w-10 h-10"}, [
                    h("img", {
                        class: "w-10 h-10 rounded-lg relative",
                        src: displayableUrl.value
                    }),
                    renderNotificationBuble()
                ])
            }
        }

        onUnmounted(() => {
          window.kiosk.context.assetsStorage().then(async (ability: IAssetsStorageAbility) => {
            ability.revokeURL(displayableUrl.value)
          })
        })

        const renderNotificationBuble = () => {
          const {notification_duration} = window.kiosk
          const mediaWhen = moment(props.updated_at);
          if (moment().diff(mediaWhen, "days") < notification_duration) {
            return [
                h("div", {class: "absolute bg-red-500 w-3 h-3 animate-ping-slow rounded-full -top-1 -left-1"}),
                h("div", {
                    class: "absolute flex justify-center items-center bg-red-500 w-3 h-3 rounded-full -top-1 -left-1"
                })
            ]
          } else {
            return null
          }
        }

        return () => h("div", {
            onClick: () => previewMedia(),
            class: "w-full pl-4 h-16 flex flex-row items-center space-x-3 cursor-pointer"
        }, [
            renderItemPreview(),
            h("div", {
                class: "w-full border-b border-gray-200 flex justify-between items-end"
            }, [
                h("span", {
                    class: "text text-gray-500 mb-2"
                }, props.name),
                h("span", {
                    class: "text-xs text-gray-400"
                }, moment(props.updated_at).fromNow())
            ])
        ])
    }
})
