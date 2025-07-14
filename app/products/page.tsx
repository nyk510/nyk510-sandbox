import Link from "next/link";
import { FC } from "react";

type ProductItem = {
    title: string,
    slug: string,
    description: string
}
const ProductItemCard: FC<ProductItem> = ({ title, slug, description }) => {
    return <Link href={`/products/${slug}`}>
        <div className="outline-3 divide-y overflow-hidden hover:outline-10 transition-all">
            <div className="h-60 overflow-hidden">
                <img
                    src={`/${slug}.png`} alt=""
                    className="bg-gray-100 grayscale w-full h-full object-cover"></img>
            </div>
            <div className="p-4 flex flex-col gap-2">
                <h4 className="text-lg">
                    {title}
                </h4>
                <div>{description}</div>
            </div>
        </div>
    </Link>
}


const items: ProductItem[] = [
    {
        title: "たくさんの時計",
        slug: "001__tick",
        description: "12 × 12 Clock Grid",
    },
    {
        title: "Moon Calendar",
        slug: "002__moon",
        description: "月ごとの、月のようす。"
    }
]

export default function ProductIndexPage() {
    return <div className="h-screen divide-y">

        <div className='flex p-4 gap-4'>
            <div>/</div>
            <Link href={"/products"}>products</Link>
        </div>

        <div className="p-12 container mx-auto flex flex-col gap-4">
            <h2 className="text-3xl">Products</h2>
            <div>つくったものたち</div>

            <div className="grid grid-cols-3 gap-8">
                {
                    items.map(v => {
                        return <ProductItemCard key={v.title} {...v}></ProductItemCard>
                    })
                }
            </div>
        </div>
    </div>
}