import { Validation } from "@/types/api.type";
import { message } from "antd";

export const handleMessaeApiValidation = (validations? : Validation) => {
    if (validations !== undefined) {
        Object.keys(validations).forEach((field) => {
            if (validations?.hasOwnProperty(field)) {
                const err = validations[field][0];
                message.error({
                    content : err,
                    style : {
                        right : 0
                    }
                })
            }
        });
        throw new Error();
    }
}