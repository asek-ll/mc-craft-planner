import { BatchItemLoader } from './items/items.service';
import { ItemStack, RawItemStack } from './recipes/recipe';

export class ItemStackUtils {
    public static toItemStacks(items: RawItemStack[], loader: BatchItemLoader): ItemStack[] {

        if (!items) {
            return null;
        }

        const result: ItemStack[] = [];

        items.forEach((stack, i) => {
            loader.load(stack.sid).then(item => {
                result.push(new ItemStack(item, stack.size));
            });
        });

        return result;
    }

    public static toRawStacks(stacks: ItemStack[]): RawItemStack[] {
        return stacks.map(stack => {
            const rawStack = new RawItemStack();
            rawStack.sid = stack.item.sid;
            rawStack.size = stack.size;
            return rawStack;
        });

    }
}
