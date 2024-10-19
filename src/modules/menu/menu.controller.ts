import { Request, Response, NextFunction } from "express";
import menuModel from "../../models/Menu";
import { IMenu } from "../../interfaces/menu";


const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await menuModel.createValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const { href, title, parent } = req.body;

        const menu = await menuModel.create({ title, href, parent });

        res.status(201).json(menu);
        return
    } catch (error) {
        next(error);
    }
};

const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const menus: IMenu[] = await menuModel.find().lean();
        if (!menus.length) {
            res.status(401).json({ message: "No Menus Available!" });
            return;
        }

        for (const menu of menus) {
            const submenus: IMenu[] = [];
            for (let i = 0; i < menus.length; i++) {
                const m = menus[i];
                if (m.parent?.toString() === menu._id.toString()) {
                    submenus.push(menus.splice(i, 1)[0]);
                    i = i - 1;
                }
            }
            menu.submenus = submenus;
        }

        res.json(menus);
    } catch (error) {
        next(error);
    }
};

const getAllPanelMenus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const menus = await menuModel.find({}).populate("parent").lean();
        if (!menus.length) {
            res.status(401).json({ message: "No Topbar Link Available!" });
            return
        }
        res.json(menus);
        return
    } catch (error) {
        next(error);
    }
};

const getAllTopbarLinks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const menus = await menuModel.find().lean();
        if (menus.length === 0) {
            res.status(401).json({ message: "No Topbar Link Available!" });
            return
        }
        let topbarLinks = [];

        for (const menu of menus) {
            if (menu.parent) {
                topbarLinks.push(menu);
            }
        }
        res.json(topbarLinks);
        return
    } catch (error) {
        next(error);
    }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await menuModel.removeValidation({ id: req.params.id }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const deletedMenu = await menuModel.findOneAndDelete({
            _id: req.params.id,
        });
        if (!deletedMenu) {
            res.status(401).json({ message: "Menu Not Found!" });
            return
        }
        res.json({message: "menu removed successfully"});
        return
    } catch (error) {
        next(error);
    }
};


export {
    create,
    getAll,
    getAllPanelMenus,
    getAllTopbarLinks,
    remove
}