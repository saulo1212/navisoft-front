import PageBreadcrumb from "@/components/PageBreadcrumb";
import {Metadata} from "next";

export const metadata:Metadata = {title:'Blank Page'}
const page = () => {
    return (
        <div className="content-wrapper">
            <PageBreadcrumb title={'Blank Page'} subTitle1={'Insights'}/>
        </div>
    );
};

export default page;
