import { Breadcrumb } from "antd";
import React from "react";


interface Breadcrumb {
    label : string;
    to : string;
}

interface Props {
    items : Breadcrumb[];
}

const Breadcrumbs : React.FC<Props> = ({items}) => {
    return (
        <Breadcrumb style={{ margin: '16px 0' }}>
            {
                items.map((item, index) => (
                    <Breadcrumb.Item key={index} href={item.to || ""} >{item.label}</Breadcrumb.Item>
                ))
            }
        </Breadcrumb>
    )
}

export default Breadcrumbs;