import {
  ISlideOptionsContext,
  SlideOptionsModule, VueInstance
} from "@comeen/comeen-play-sdk-js";

export default class KioskOptionsModule extends SlideOptionsModule {
  constructor(context: ISlideOptionsContext) {
    super(context);
  }

  async onReady() {
    return true;
  };

  setup(props: Record<string, any>, vue: VueInstance, context: ISlideOptionsContext) {
    const { h } = vue;

    const update = context.update;

    const { Field, TextInput, Toggle, MediaPicker, NumberInput, FieldsRow } = this.context.components

    return () => [
        h(Field, { label: this.t('modules.kiosk.options.new_document_date') }, [
            h("div", {
                class: "flex flex-row items-center space-x-2"
            }, [
                h(NumberInput, {
                    min: 1, max: 100, default: 5, ...update.option("notification_duration"),
                    class: "w-1/4"
                }),
                h("span", {
                    class: "text-sm"
                }, this.t("modules.kiosk.options.days"))
            ]),
            h("span", {
                class: "text-xs text-gray-400"
            }, this.t("modules.kiosk.options.new_document_date_desc"))
        ]),
        h(Field, { label: this.t('modules.kiosk.options.notification_time') }, [
            h("div", {
                class: "flex flex-row items-center space-x-2"
            }, [
                h(TextInput, {

                    class: "w-1/4"
                }),
            ]),
            h("span", {
                class: "text-xs text-gray-400"
            }, this.t("modules.kiosk.options.new_document_date_desc"))
        ]),
    ];
  }
}
