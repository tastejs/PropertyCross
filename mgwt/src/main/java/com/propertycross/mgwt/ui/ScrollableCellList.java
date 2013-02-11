package com.propertycross.mgwt.ui;

import java.util.ArrayList;
import java.util.List;
import com.google.gwt.safehtml.shared.SafeHtmlBuilder;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.HasWidgets;
import com.googlecode.mgwt.ui.client.widget.CellList;
import com.googlecode.mgwt.ui.client.widget.ScrollPanel;
import com.googlecode.mgwt.ui.client.widget.celllist.Cell;
import com.googlecode.mgwt.ui.client.widget.celllist.CellSelectedEvent;
import com.googlecode.mgwt.ui.client.widget.celllist.CellSelectedHandler;
import com.propertycross.mgwt.navigation.Navigable;

final class ScrollableCellList implements Navigable {

    private final CellList<ClickableCell> cl =
            new CellList<ClickableCell>(new ClickableCellCell());
    private List<ClickableCell> cells;
    private final ScrollPanel scroller = new ScrollPanel();

    public ScrollableCellList()
    {
        cl.addCellSelectedHandler(new CellSelectedHandler() {

            @Override public void onCellSelected(CellSelectedEvent e)
            {
                cells.get(e.getIndex()).onClick();
            }

        });
        scroller.setWidget(cl);
    }

    @Override
    public void addTo(HasWidgets panel)
    {
        panel.add(scroller);
    }

    public void render(List<ClickableCell> cells)
    {
        this.cells = new ArrayList<ClickableCell>(cells);

        cl.render(this.cells);

        scroller.refresh();

        // fudge since cl.render() returns before complete, so wait to refresh
        new Timer() {

            @Override public void run()
            {
                scroller.refresh();
            }

        }.schedule(500);
    }

    public interface ClickableCell {

        void appendTo(SafeHtmlBuilder b);
        void onClick();

    }

    private final class ClickableCellCell implements Cell<ClickableCell> {

        @Override
        public void render(SafeHtmlBuilder b, ClickableCell p)
        {
            p.appendTo(b);
        }

        @Override
        public boolean canBeSelected(ClickableCell p)
        {
            return true;
        }

    }

}
